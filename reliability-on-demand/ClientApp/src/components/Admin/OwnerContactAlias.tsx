import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/TeamModel'
import { CreateNewID, DummyID } from '../helpers/utils'

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
          setPreviousTeamID(props.currentTeam?.teamID ?? CreateNewID)
      setTextFieldValue(newValue || '')
      props.callback(newValue)
    },
    [props]
  )

  const getSelectedKey = (currenTeam: TeamConfig | undefined) => {
    // To make the field editable for update as well.
      if (currenTeam?.teamID !== previousTeamID) {
      props.callback(currenTeam?.ownerContact)
      return currenTeam?.ownerContact
    }
    return textFieldValue
  }

    React.useEffect(() => {
        setTextFieldValue(props.currentTeam?.ownerContact || '')
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
    />
  )
}
