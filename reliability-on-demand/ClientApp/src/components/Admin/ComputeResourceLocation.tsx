import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'
import { CreateNewID, DummyID } from '../helpers/utils'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const ComputeResourceLocation = (props: Props) => {
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
      props.callback(currenTeam?.computeResourceLocation)
      return currenTeam?.computeResourceLocation
    }
    return textFieldValue
  }

  React.useEffect(() => {
    setTextFieldValue(props.currentTeam?.computeResourceLocation || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Compute Resource Location"
      placeholder="e.g. https://cosmos15.osdinfra.net/cosmos/asimov.partner.swat/"
      validateOnLoad={false}
      value={getSelectedKey(props.currentTeam)}
      onChange={handleTextInput}
      validateOnFocusOut
      aria-label="Compute Resource Location"
    />
  )
}
