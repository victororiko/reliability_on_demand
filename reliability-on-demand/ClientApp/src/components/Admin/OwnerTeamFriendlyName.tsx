import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'
import { CreateNewID, DummyID } from '../helpers/utils'
import { getControlValue, getErrorMessage } from './helper'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const OwnerTeamFriendlyName = (props: Props) => {
  const [textFieldValue, setTextFieldValue] = React.useState(
    props.currentTeam?.OwnerTeamFriendlyName
  )
  const handleTextInput = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setTextFieldValue(newValue || '')
      props.callback(newValue)
    },
    [props]
  )

  // For client side error - checks if the textfield is empty, displays the error.
  const onGetErrorMessageHandler = (value: string) => {
    return getErrorMessage(value, props.callback)
  }

  React.useEffect(() => {
    setTextFieldValue(props.currentTeam?.OwnerTeamFriendlyName || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Owner Team Friendly Name"
      required
      placeholder="e.g. Client FUN Engineering Team"
      validateOnLoad={false}
      value={textFieldValue}
      onChange={handleTextInput}
      validateOnFocusOut
      aria-label="Owner contact (alias)"
      onGetErrorMessage={(value) => {
        return onGetErrorMessageHandler(value)
      }}
    />
  )
}
