import { TextField } from '@fluentui/react'
import React from 'react'
import { TeamConfig } from '../../models/team.model'

interface IOwnerTriageAliasProps {
  currentTeam?: TeamConfig
}

export const OwnerTriageAlias = (props: IOwnerTriageAliasProps) => {
  return (
    <div>
      <TextField
        label="Owner Triage (alias)"
        suffix="@microsoft.com"
        placeholder="e.g. cosreldata"
        aria-label="Owner contact (alias)"
        disabled={props.currentTeam !== undefined}
        value={props.currentTeam ? props.currentTeam.OwnerTriageAlias : 'empty'}
      />
    </div>
  )
}
