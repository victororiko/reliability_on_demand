import { Dropdown, IDropdownOption } from '@fluentui/react'
import React from 'react'
import { StudyConfig } from '../../models/config.model'

interface Props {
  currentStudy?: StudyConfig
  callBack: any
}

export const FrequencyDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>()
  // -2 is just an initialization of the previous study id.
  const [previouStudyID, setPreviouStudyID] = React.useState('-2')
  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: any
  ): void => {
    setPreviouStudyID(props.currentStudy?.StudyID ?? '')
    setSelectedItem(item)
    // send back the selection made by user or set it to default =
    props.callBack(item ? item.key : 24)
  }

  const getSelectedKey = (currentStudy: StudyConfig | undefined) => {
    if (
      (currentStudy && currentStudy?.StudyID != previouStudyID) ||
      (previouStudyID !== '-2' && currentStudy === undefined)
    ) {
      return currentStudy?.CacheFrequency
    }
    return selectedItem ? selectedItem.key : 24
  }

  return (
    <Dropdown
      placeholder="Select a frequency"
      label="Frequency"
      selectedKey={getSelectedKey(props.currentStudy)}
      onChange={onChange}
      options={hardCodedFrequencies}
      required
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
