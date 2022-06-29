import {
  IComboBox,
  IComboBoxOption,
  Stack,
  VirtualizedComboBox,
} from '@fluentui/react'
import axios from 'axios'
import React, { FormEvent, useEffect, useState } from 'react'
import { UserPivotConfig } from '../../models/pivot.model'
import { MessageBox } from '../helpers/MessageBox'
import { containerStackTokens, horizontalStackTokens } from '../helpers/Styles'
import { ClearPivotConfigButton } from './ClearPivotConfigButton'
import { PivotList } from './PivotList'
import { SavePivotConfigButton } from './SavePivotConfigButton'
import { convertPivotInfoToOptions } from './service'

type Props = {
  pivotSource: string
  studyid: number
}

const PivotCombobox = (props: Props) => {
  const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
  const [populationPivots, setPopulationPivots] = useState([])
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    // clear any previous add/clear statuses from UI
    setStatus('')
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
        `api/Data/GetUserPivotConfigs/PivotSource/${props.pivotSource}/StudyId/${props.studyid}`
      )
      .then((response) => {
        if (response.data) {
          const arr = response.data as UserPivotConfig[]
          const ans = arr.map((item) => {
            const rObj = {
              ...item,
              key: item.PivotID,
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

  const handleChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined,
    index?: number | undefined,
    value?: string | undefined
  ) => {
    if (option !== undefined) {
      // if option has already been selected - remove it from selectedItems
      if (
        selectedItems.find((item) => {
          return item.key === option.key
        })
      ) {
        const newList = selectedItems.filter((item) => {
          return item.key !== option.key
        })
        setSelectedItems(newList)
      }
      // add the new selection to list of existing selections
      else setSelectedItems([...selectedItems, option])
    }
  }

  const handleStatus = (statusFromBackend: string) => {
    setStatus(statusFromBackend)
  }

  return (
    <div>
      <VirtualizedComboBox
        calloutProps={{ doNotLayer: true }}
        label="Pivots"
        options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
        onChange={handleChange}
        allowFreeform
        multiSelect
        placeholder="type a pivot name to search OR select from the list"
        selectedKey={selectedItems.map((item) => {
          return item.key as string
        })}
        text={`${selectedItems.length} pivots selected`}
      />
      {selectedItems.length > 0 ? (
        <Stack tokens={containerStackTokens}>
          <PivotList
            selectedItems={selectedItems}
            pivotSource={props.pivotSource}
          />
          <Stack horizontal tokens={horizontalStackTokens}>
            <SavePivotConfigButton
              studyid={props.studyid}
              selectedPivots={selectedItems}
              callbackStatus={handleStatus}
            />
            <ClearPivotConfigButton
              studyid={props.studyid}
              selectedPivots={selectedItems}
              callbackStatus={handleStatus}
            />
            <MessageBox message={status} />
          </Stack>
        </Stack>
      ) : (
        ''
      )}
    </div>
  )
}

export default PivotCombobox
