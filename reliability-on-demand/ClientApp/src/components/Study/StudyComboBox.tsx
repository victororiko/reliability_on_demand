import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { StudyConfig } from '../../models/config.model'
import { convertToOptions, getStudyConfig } from './model'
import { StudyDetails } from './StudyDetails'

interface Props {
  teamid: number
  data: StudyConfig[]
  callBack: any
  callBacksetStudyId: any
}

export const StudyComboBox = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState<IComboBoxOption | null>(null)
  useEffect(() => {
    setSelectedItem(null) // force combobox to show placeholder text by default
  }, [props.data])

  const handleChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined,
    index?: number | undefined,
    value?: string | undefined
  ) => {
    if (option !== undefined) {
      setSelectedItem(option)
      props.callBacksetStudyId(option.key)
    }
  }

  return (
    <div>
      <VirtualizedComboBox
        label="Study"
        selectedKey={selectedItem?.key || null}
        options={convertToOptions(props.data)}
        onChange={handleChange}
        allowFreeform
        useComboBoxAsMenuWidth
        placeholder="type a study name to search OR create a new study"
      />
      {selectedItem ? (
        <StudyDetails
          callback={props.callBack}
          teamid={props.teamid}
          selectedStudy={getStudyConfig(
            props.data,
            selectedItem.key.toString()
          )}
        />
      ) : (
        ''
      )}
    </div>
  )
}
