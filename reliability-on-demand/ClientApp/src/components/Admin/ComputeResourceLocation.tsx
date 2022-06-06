import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'

export interface Props {
  currentTeam?: TeamConfig
  callback: any
}

export const ComputeResourceLocation = (props: Props) => {
  const [textFieldValue, setTextFieldValue] = React.useState(
    props.currentTeam?.ComputeResourceLocation
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

  React.useEffect(() => {
    setTextFieldValue(props.currentTeam?.ComputeResourceLocation || '')
  }, [props.currentTeam])

  return (
    <TextField
      label="Compute Resource Location"
      placeholder="e.g. https://cosmos15.osdinfra.net/cosmos/asimov.partner.swat/"
      validateOnLoad={false}
      value={textFieldValue}
      onChange={handleTextInput}
      validateOnFocusOut
      aria-label="Compute Resource Location"
    />
  )
}
