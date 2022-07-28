import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect, useState } from 'react'

interface IMyMultiSelectComboBoxProps {
  options: IComboBoxOption[]
  callback: any
  label: string
  placeholder: string
  selectedItems: IComboBoxOption[] // make sure you pass in empty array if no selections exist
}

export const MyMultiSelectComboBox = (props: IMyMultiSelectComboBoxProps) => {
  const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])

  useEffect(() => {
    setSelectedItems(props.selectedItems) // force combobox to show placeholder text if no selections exist
  }, [props.selectedItems])

  // call this whenever user selects an item
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
        props.callback(newList)
      }
      // add the new selection to list of existing selections
      else {
        const concatenatedList = [...selectedItems, option]
        setSelectedItems(concatenatedList)
        props.callback(concatenatedList)
      }
    }
  }

  return (
    <div>
      <VirtualizedComboBox
        label={props.label}
        options={props.options}
        onChange={handleChange}
        allowFreeform
        autoComplete="on"
        multiSelect
        placeholder={props.placeholder}
        selectedKey={props.selectedItems.map((item) => {
          return item.key as string
        })}
        text={`${props.selectedItems.length} items selected`}
      />
    </div>
  )
}
