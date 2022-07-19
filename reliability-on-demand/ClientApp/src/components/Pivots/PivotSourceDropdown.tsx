import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { PivotSource } from '../../models/pivot.model'
import PivotCombobox from './PivotComboBox'
import { convertPivotSourceToOptions } from './service'

type Props = {
  pivotSources: PivotSource[]
  StudyConfigID: number
}

const PivotSourceDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState<IComboBoxOption | null>(null)
  useEffect(() => {
    setSelectedItem(null) // force combobox to show placeholder text by default
  }, [props])

  const handleChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined,
    index?: number | undefined,
    value?: string | undefined
  ) => {
    if (option !== undefined) {
      setSelectedItem(option)
    }
  }

  return (
    <div>
      <VirtualizedComboBox
        label="Pivot Source"
        selectedKey={selectedItem?.key || null}
        options={convertPivotSourceToOptions(props.pivotSources)}
        onChange={handleChange}
        allowFreeform
        useComboBoxAsMenuWidth
        placeholder="type a Pivot Source to search OR select from the list"
      />
      {selectedItem === null ? (
        ''
      ) : (
        <PivotCombobox
          pivotSource={selectedItem.text}
          StudyConfigID={props.StudyConfigID}
        />
      )}
    </div>
  )
}

export default PivotSourceDropdown
