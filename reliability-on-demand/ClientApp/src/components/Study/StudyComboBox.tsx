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
    props.callBack(option ? option.text : 'create new study')
  }

  const convertToOptions = (inputData: StudyConfig[]) => {
    let parsedList: IComboBoxOption[] = []
    if (inputData) {
      parsedList = inputData.map((item) => {
        const rObj = {
          key: item.StudyName,
          text: item.StudyName,
        }
        return rObj
      })
    }
    parsedList.push({
      key: 'create new study',
      text: 'create new study',
    })
    return parsedList
  }

  // preserve previous user selection if user selected a study -> changed team -> and
  // came back to original team selection
  // Otherwise show default: create new study
  const selectedKeyLogic = (inputData: StudyConfig[]) => {
    if (inputData && inputData.length > 0)
      return selectedItem && selectedItem.key !== ''
        ? selectedItem.key
        : 'create new study'
    return 'create new study'
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
