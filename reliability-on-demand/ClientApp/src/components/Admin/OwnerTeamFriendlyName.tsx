import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/TeamModel'
import { CreateNewID, DummyID, EmptyFieldErrorMessage } from '../helpers/utils'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const OwnerTeamFriendlyName = (props: Props) => {
  const [textFieldValue, setTextFieldValue] = React.useState('')
  const [previousTeamID, setPreviousTeamID] = React.useState(DummyID)
  const handleTextInput = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setPreviousTeamID(props.currentTeam?.teamID ?? CreateNewID)
      setTextFieldValue(newValue || '')
      props.callback(newValue)
    },
    [props]
  )

  const getSelectedKey = (currenTeam: TeamConfig | undefined) => {
    // To make the field editable for update as well.
    if (currenTeam?.teamID !== previousTeamID) {
      props.callback(currenTeam?.ownerTeamFriendlyName)
      return currenTeam?.ownerTeamFriendlyName
    }

    return textFieldValue
    }

    // For client side error - checks if the textfield is empty, displays the error.
    const onGetErrorMessageHandler = (value: string) => {
        if (value === '') {
            props.callback(value)
            return EmptyFieldErrorMessage
        }
        return ''
    }

  React.useEffect(() => {
    setTextFieldValue(props.currentTeam?.ownerTeamFriendlyName || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Owner Team Friendly Name"
      required
      placeholder="e.g. Client FUN Engineering Team"
      validateOnLoad={false}
      value={getSelectedKey(props.currentTeam)}
      onChange={handleTextInput}
      validateOnFocusOut
      aria-label="Owner contact (alias)"
      onGetErrorMessage={(value) => { return onGetErrorMessageHandler(value) }}
    />
  )
}
