import { IComboBoxOption } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MessageBox } from '../helpers/MessageBox'
import { MyMultiSelectComboBox } from '../helpers/MyMultiSelectComboBox'
import { SavePivotConfigButton } from './SavePivotConfigButton'
import { convertPivotInfoToOptions } from './service'

interface IPivotConfigDetailsProps {
  pivotSource: string
  StudyConfigID: number
}

export const PivotConfigDetails = (props: IPivotConfigDetailsProps) => {
  const [populationPivots, setPopulationPivots] = useState([])
  const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
  const [backendStatus, setBackendStatus] = useState('')

  useEffect(() => {
    // get all pivots
    axios
      .get(`api/Data/GetPopulationPivots/${props.pivotSource}`)
      .then((response) => {
        if (response.data) setPopulationPivots(response.data)
        else setPopulationPivots([])
      })
      .catch((exception) => {
        return console.error(exception)
      })
    // set user selections
    axios
      .get(
        `api/Data/GetUserPivotConfigs/PivotSource/${props.pivotSource}/StudyConfigID/${props.StudyConfigID}`
      )
      .then((response) => {
        if (response.data) {
          const arr = response.data
          const ans = arr.map((item: any) => {
            const rObj = {
              ...item,
              key: item.PivotKey,
              text: item['dbo.RELPivotInfo'][0].PivotName, // using [0] because the array will only have 1 object - SQL weirdness
            }
            return rObj
          })
          setSelectedItems(ans) // force combobox to show placeholder text by default
        } else setSelectedItems([])
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }, [props.pivotSource])

  // callbacks
  const handleCallBack = (selections: IComboBoxOption[]) => {
    console.log(JSON.stringify(selections, null, 2))
    setSelectedItems(selections)
  }

  const handleBackendStatus = (value: string) => {
    setBackendStatus(value)
  }

  return (
    <div>
      <h1>PivotConfigDetails</h1>
      <MyMultiSelectComboBox
        options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
        callback={handleCallBack}
        label="Pivots"
        placeholder="type a pivot name to search OR select from the list"
        selectedItems={selectedItems}
      />
      <SavePivotConfigButton
        StudyConfigID={props.StudyConfigID}
        selectedPivots={selectedItems}
        callbackStatus={handleBackendStatus}
      />
      <MessageBox message={backendStatus} />
    </div>
  )
}
