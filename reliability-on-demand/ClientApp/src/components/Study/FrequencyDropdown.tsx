import { Dropdown, IDropdownOption } from '@fluentui/react'
import React from 'react'
import { StudyConfig } from '../../models/config.model'

interface Props {
  currentStudy?: StudyConfig
  callBack: any
}

export const FrequencyDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>()
  const onChange = (event: React.FormEvent<HTMLDivElement>, item: any): void => {
    setSelectedItem(item)
    // send back the selection made by user or set it to default =
    props.callBack(item ? item.key : 0)
  }

  const getSelectedKey = (currentStudy: StudyConfig | undefined) => {
    if (currentStudy) {
      return currentStudy?.CacheFrequency
    } else return selectedItem ? selectedItem.key : 0
  }

  return (
    <Dropdown
      placeholder="Select a frequency"
      label="Frequency"
      selectedKey={getSelectedKey(props.currentStudy)}
      onChange={onChange}
      options={hardCodedFrequencies}
      required
      disabled={props.currentStudy !== undefined}
    />
  )
}

const hardCodedFrequencies: IDropdownOption[] = [
  { key: 0, text: 'none' },
  { key: 1, text: 'hourly' },
  { key: 168, text: 'weekly' },
  { key: 12, text: 'every 12 hours' },
  { key: 24, text: 'every 24 hours' },
  { key: 72, text: 'every 3 days' },
]
