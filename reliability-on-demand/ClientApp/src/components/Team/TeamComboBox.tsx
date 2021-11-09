import { IComboBox, IComboBoxOption, VirtualizedComboBox } from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { TeamConfig } from '../../models/config.model'

interface Props {
  data: TeamConfig[]
  callBack: any
}

export const TeamComboBox = (props: Props) => {
  // onMount
  useEffect(() => {
    console.debug('Mounted TeamComboBox')
    return () => {
      console.debug('UnMounted TeamComboBox')
    }
  }, [])

  // state
  const [selectedItem, setSelectedItem] = React.useState<IComboBoxOption>()
  // core interation methods
  const onChange = (event: FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
    setSelectedItem(option)
    props.callBack(option ? option.key : -1)
  }

  const convertToOptions = (inputData: any) => {
    let parsedList: IComboBoxOption[] = []
    parsedList = inputData.map((item: TeamConfig) => {
      let rObj = {
        key: item.teamID,
        text: item.ownerTeamFriendlyName,
      }
      return rObj
    })
    parsedList.push({
      key: -1,
      text: 'create new team',
    })
    return parsedList
  }

  return (
    <div>
      <VirtualizedComboBox
        selectedKey={selectedItem ? selectedItem.key : -1}
        label="Team"
        allowFreeform
        autoComplete="on"
        options={convertToOptions(props.data)}
        useComboBoxAsMenuWidth
        onChange={onChange}
        placeholder="Select a Team"
      />
    </div>
  )
}
