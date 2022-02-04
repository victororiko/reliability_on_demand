import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { StudyConfig } from '../../models/config.model'

interface Props {
  data: StudyConfig[]
  callBack: any
}

export const StudyComboBox = (props: Props) => {
  // onMount
  useEffect(() => {
    console.debug('Mounted StudyComboBox')
    return () => {
      console.debug('UnMounted StudyComboBox')
    }
  }, [])

  // state
  const [selectedItem, setSelectedItem] = React.useState<IComboBoxOption>()
  // core interation methods
  const onChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined
  ): void => {
    setSelectedItem(option)
    props.callBack(option?.text)
  }

  const convertToOptions = (inputData: StudyConfig[]) => {
    let parsedList: IComboBoxOption[] = []
    if (inputData) {
      parsedList = inputData.map((item) => {
        const rObj = {
          key: item.StudyID.toString(),
          text: item.StudyName,
        }
        return rObj
      })
    }

    // -1 is used as key for the new study to just identify in the code whether user wants to add a study or update an existing study
    parsedList.push({
      key: '-1',
      text: 'create new study',
    })
    return parsedList
  }

  // preserve previous user selection if user selected a study -> changed team -> and
  // came back to original team selection
  // Otherwise show default: create new study
  const selectedKeyLogic = (inputData: StudyConfig[]) => {
    if (inputData && inputData.length > 0)
      return selectedItem && selectedItem.key !== '' ? selectedItem.key : '-1'
    return '-1'
  }

  return (
    <div>
      <VirtualizedComboBox
        selectedKey={selectedKeyLogic(props.data)}
        label="Study"
        allowFreeform
        autoComplete="on"
        options={convertToOptions(props.data)}
        useComboBoxAsMenuWidth
        onChange={onChange}
        // placeholder="type a study name to search OR create a new study"
      />
    </div>
  )
}
