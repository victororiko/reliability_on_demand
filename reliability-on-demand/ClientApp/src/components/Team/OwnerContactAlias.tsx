import { TextField } from '@fluentui/react'
import React from 'react'
import { TeamConfig } from '../../models/team.model'

interface IOwnerContactAliasProps {
  currentTeam?: TeamConfig
}

export const OwnerContactAlias = (props: IOwnerContactAliasProps) => {
  return (
    <div>
      <TextField
        label="Owner contact (alias)"
        suffix="@microsoft.com"
        placeholder="e.g. johndoe"
        aria-label="Owner contact (alias)"
        disabled={props.currentTeam !== undefined}
        value={props.currentTeam ? props.currentTeam.OwnerContact : 'empty'}
      />
    </div>
  )
}
