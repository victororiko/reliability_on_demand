import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent } from 'react'
import { TeamConfig } from '../../models/team.model'
import {
  convertComplexTypeToOptions,
  convertSimpleTypeToOptions,
} from '../helpers/utils'

interface Props {
  data: TeamConfig[]
  callBack: any
}

export const TeamComboBox = (props: Props) => {
  // state
  const [selectedItem, setSelectedItem] = React.useState<IComboBoxOption>()
  // core interation methods
  const onChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined
  ): void => {
    setSelectedItem(option)
    props.callBack(option ? option.key : -1)
  }

  const convertToOptions = (inputData: any) => {
    let parsedList: IComboBoxOption[] = []
    parsedList = inputData.map((item: TeamConfig) => {
      const rObj = {
        key: item.TeamID,
        text: item.OwnerTeamFriendlyName,
      }
      return rObj
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
        options={props.data.map((item) => {return {
          key: item.TeamID,
          text: item.OwnerTeamFriendlyName,
        }})}
        useComboBoxAsMenuWidth
        onChange={onChange}
        placeholder="Select a Team"
      />
    </div>
  )
}
