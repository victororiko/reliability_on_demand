import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'
import { getErrorMessage } from './helper'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const OwnerContactAlias = (props: Props) => {
  // -2 is just an initialization for the previous study.
  const [textFieldValue, setTextFieldValue] = React.useState(
    props.currentTeam?.OwnerContact
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
    setTextFieldValue(props.currentTeam?.OwnerContact || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Owner Contact (Alias)"
      suffix="@microsoft.com"
      required
      placeholder="e.g. johndoe"
      value={textFieldValue}
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
