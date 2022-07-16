import {
  IComboBox,
  IComboBoxOption,
  VirtualizedComboBox,
} from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { TeamConfig } from '../../models/team.model'
import { CreateNewID } from '../helpers/utils'

interface Props {
  data: TeamConfig[]
  callBack: any
  currentTeam?: TeamConfig
}

export const TeamComboBox = (props: Props) => {
  // state
  const [selectedItem, setSelectedItem] = React.useState<IComboBoxOption>()

  // lifecycle methods
  useEffect(() => {
    if (props.currentTeam)
      setSelectedItem({
        key: props.currentTeam.TeamID,
        text: props.currentTeam.OwnerTeamFriendlyName,
      })
  }, [props])

  // core interation methods
  const onChange = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined
  ): void => {
    if (option !== undefined) {
      setSelectedItem(option)
      props.callBack(option ? option.key : CreateNewID)
    }
  }

  return (
    <div>
      <VirtualizedComboBox
        selectedKey={selectedItem?.key || null}
        label="Team"
        allowFreeform
        autoComplete="on"
        options={props.data.map((item) => {
          return {
            key: item.TeamID,
            text: item.OwnerTeamFriendlyName,
          }
        })}
        useComboBoxAsMenuWidth
        onChange={onChange}
        placeholder="Select a Team"
      />
    </div>
  )
}
