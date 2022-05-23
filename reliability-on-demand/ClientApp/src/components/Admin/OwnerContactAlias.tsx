import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'
import { CreateNewID, DummyID } from '../helpers/utils'
import { getControlValue, getErrorMessage } from './helper'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const OwnerContactAlias = (props: Props) => {
  // -2 is just an initialization for the previous study.
  const [textFieldValue, setTextFieldValue] = React.useState('')
  const [previousTeamID, setPreviousTeamID] = React.useState(DummyID)
  const handleTextInput = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setPreviousTeamID(props.currentTeam?.TeamID ?? CreateNewID)
      setTextFieldValue(newValue || '')
      props.callback(newValue)
    },
    [props]
  )

  const getSelectedKey = (currenTeam: TeamConfig | undefined) => {
    // To make the field editable for update as well.
    return getControlValue(
      currenTeam,
      textFieldValue,
      previousTeamID,
      props.callback,
      currenTeam?.OwnerContact
    )
  }

  // For client side error - checks if the textfield is empty, displays the error.
  const onGetErrorMessageHandler = (value: string) => {
    return getErrorMessage(value, props.callback)
  }

  React.useEffect(() => {
    setTextFieldValue(props.currentTeam?.OwnerContact || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Owner Contact (Alias)"
      suffix="@microsoft.com"
      required
      placeholder="e.g. johndoe"
      value={getSelectedKey(props.currentTeam)}
      onChange={handleTextInput}
      validateOnLoad={false}
      validateOnFocusOut
      aria-label="Owner contact (alias)"
      onGetErrorMessage={(value) => {
        return onGetErrorMessageHandler(value)
      }}
    />
  )
}
