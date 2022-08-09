import { IComboBoxOption, selectProperties } from '@fluentui/react'
import axios from 'axios'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Loading } from '../helpers/Loading'
import { AllSourceType } from '../helpers/utils'
import { MySingleSelectComboBox } from '../helpers/MySingleSelectComboBox'
import { MyMultiSelectComboBox } from '../helpers/MyMultiSelectComboBox'
import { Pivot } from '../../models/pivot.model'
import { convertToPivot, AddNewPivotsToDetailedList } from './helper'
import { PivotsDetailedList } from './PivotsDetailedList'

export interface IManagePivotsProps {}

// Added randomly to check how pivots switching looks.
// Will be removed in next PR to implement the UI for this.
export const ManagePivots = (props: IManagePivotsProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [sources, setSources] = useState<IComboBoxOption[]>([])
  const [selectedSource, setSelectedSource] = useState<IComboBoxOption>()
  const [allPivots, setAllPivots] = useState<IComboBoxOption[]>([])
  const [selectedPivotsPair, setSelectedPivotsPair] = useState<
    IComboBoxOption[]
  >([])
  const [selectedPivots, setSelectedPivots] = useState<Pivot[]>([])
  const [sourceSelected, setSourceSelected] = useState<Boolean>(false)

  useEffect(() => {
    setSourceSelected(false)
    setLoading(true)
    axios
      .get(`api/Data/GetAllSourcesForGivenSourceType/${AllSourceType}`)
      .then((response) => {
        if (response.data) {
          const arr = response.data
          const ans = arr.map((item: any) => {
            const rObj = {
              key: item.PivotSource,
              text: item.PivotSource,
            }
            return rObj
          })
          setSources(ans) // force combobox to show placeholder text by default
        } else {
          setSources([])
        }
        setLoading(false)
        setSelectedSource(undefined) // let the user select a pivot source at each render
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }, [])

  const getAllPivotsForASource = (source: string) => {
    axios
      .get(`api/Data/GetPivotsForGivenSource/${source}`)
      .then((response) => {
        if (response.data) {
          const arr = response.data
          const ans = arr.map((item: any) => {
            const rObj = {
              key: `${item.PivotKey};${item.UIInputDataType};${item.ADLDataType}`,
              text: item.PivotSourceColumnName,
            }
            return rObj
          })
          setAllPivots(ans) // force combobox to show placeholder text by default
        } else {
          setAllPivots([])
        }
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }

  const getAllConfiguredPivotsForASource = (source: string) => {
    axios
      .get(`api/Data/GetAdminConfiguredPivotsData/${source}`)
      .then((response) => {
        if (response.data) {
          const arr = response.data
          const ans = arr.map((item: any) => {
            const rObj = {
              key: `${item.PivotKey};${item.UIDataType};${item.ADLDataType}`,
              text: item.PivotName,
            }
            return rObj
          })
          setSelectedPivotsPair(ans)
          setSelectedPivots(convertToPivot(arr))
        } else {
          setSelectedPivots([])
          setSelectedPivotsPair([])
        }
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }

  const onSourceSelected = (input: any) => {
    setSelectedSource(input)
    getAllPivotsForASource(input.key)
    getAllConfiguredPivotsForASource(input.key)
    setSourceSelected(true)
  }

  const onPivotMultiSelectUpdate = (input: IComboBoxOption[]) => {
    setSelectedPivotsPair(input)

    // removin the deselected enteries
    const temp: Pivot[] = []
    for (const ele of selectedPivots) {
      for (const selectedEle of input) {
        if (ele.PivotKey === selectedEle.key.toString().split(';')[0]) {
          temp.push(ele)
        }
      }
    }

    // Add new enteries
    const updated = AddNewPivotsToDetailedList(input, temp)
    setSelectedPivots(updated)
  }

  const onPivotDetailedlistUpdate = (input: any) => {
    setSelectedPivots(input)
  }

  const pivotDetailedList = sourceSelected ? (
    <div>
      <MyMultiSelectComboBox
        label="Pivots"
        options={allPivots}
        callback={onPivotMultiSelectUpdate}
        placeholder=""
        selectedItems={selectedPivotsPair}
      />
      <PivotsDetailedList
        data={selectedPivots}
        callBack={onPivotDetailedlistUpdate}
      />
    </div>
  ) : (
    ''
  )

  return (
    <div>
      {loading ? (
        <Loading message="Getting Data for Modify Pivot Section - hang tight" />
      ) : (
        <div>
          <MySingleSelectComboBox
            label="Sources"
            options={sources}
            placeholder="Type a source name or select a source from the list"
            selectedItem={selectedSource}
            callback={onSourceSelected}
          />
          {pivotDetailedList}
        </div>
      )}
    </div>
  )
}
