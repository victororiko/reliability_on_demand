import React from 'react'
import { Dropdown, IDropdownOption } from '@fluentui/react'
import { StudyConfig } from '../../models/config.model'

interface Props {
  currentStudy?: StudyConfig
  callBack: any
}

export const ObservationWindowDropdown = (props: Props) => {
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>()
    const [previouStudyID, setPreviouStudyID] = React.useState('-2')
  // when user selects a new dropdown value - replace current DropdownOption with that value
  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: any
  ): void => {
    setPreviouStudyID(props.currentStudy?.StudyID ?? '')
    setSelectedItem(item)
    props.callBack(item ? item.key : 0)
  }

  const getSelectedKey = (currentStudy: StudyConfig | undefined) => {
      if (((currentStudy) && (currentStudy?.StudyID != previouStudyID)) || (previouStudyID !== '-2' && currentStudy === undefined)) {
      return currentStudy?.ObservationWindowDays
    }
    return selectedItem ? selectedItem.key : 0
  }

  return (
    <Dropdown
      placeholder="Select an observation window"
      label="Observation window"
      options={hardCodedObservationWindows}
      selectedKey={getSelectedKey(props.currentStudy)}
      onChange={onChange}
    />
  )
}

// generate data for Dropdown
const hardCodedObservationWindows: IDropdownOption[] = [
  { key: 0, text: 'none' },
  { key: 14, text: '14 days' },
]
