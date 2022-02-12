import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { TeamConfig } from '../../models/TeamModel'
import { CreateNewID } from '../helpers/utils'

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
  const onChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined
  ): void => {
    setSelectedItem(option)
    props.callBack(option ? option.key : CreateNewID)
  }

  // -1 is just a way of checking in UI if user wants to add a new study or update a already existing study.
  // This is not inserted in the database.
  const convertToOptions = (inputData: any) => {
    let parsedList: IComboBoxOption[] = []
    parsedList = inputData.map((item: TeamConfig) => {
      const rObj = {
        key: item.teamID,
        text: item.ownerTeamFriendlyName,
      }
      return rObj
    })
    parsedList.push({
      key: CreateNewID,
      text: 'create new team',
    })
    return parsedList
  }

  return (
    <div>
      <VirtualizedComboBox
        selectedKey={selectedItem ? selectedItem.key : CreateNewID}
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
