import {
  IComboBox,
  IComboBoxOption,
  Stack,
  VirtualizedComboBox,
} from '@fluentui/react'
import axios from 'axios'
import React, { FormEvent, useEffect, useState } from 'react'
import { MAXNUMPIVOTSINCOMBOBOX } from '../helpers/utils'
import SavePivotConfigButton from './SavePivotConfigButton'
import { convertPivotInfoToOptions } from './service'

type Props = {
  pivotSource: string
  studyid: number
}

const PivotCombobox = (props: Props) => {
  const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
  const [populationPivots, setPopulationPivots] = useState([])

  useEffect(() => {
    setSelectedItems([]) // force combobox to show placeholder text by default
    axios
      .get(`api/Data/GetPopulationPivots/${props.pivotSource}`)
      .then((response) => {
        if (response.data) setPopulationPivots(response.data)
        else setPopulationPivots([])
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

  return (
    <div>
      <VirtualizedComboBox
        label="Pivots"
        options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
        onChange={handleChange}
        allowFreeform
        multiSelect
        placeholder="type a pivot name to search OR select from the list"
        selectedKey={selectedItems.map((item) => {
          return item.key as string
        })}
        text={
          selectedItems && selectedItems.length > MAXNUMPIVOTSINCOMBOBOX
            ? `${selectedItems.length} pivots selected`
            : undefined
        }
      />
      {selectedItems.length > 0 ? (
        <Stack>
          {/* TODO add pivots list and pivots scope here */}
          <SavePivotConfigButton studyid={props.studyid} />
        </Stack>
      ) : (
        ''
      )}
    </div>
  )
}

export default PivotCombobox
