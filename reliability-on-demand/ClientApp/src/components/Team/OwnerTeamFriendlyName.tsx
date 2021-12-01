import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/config.model'

export interface IOwnerTeamFriendlyNameAliasProps {
  currentTeam?: TeamConfig
  callback_function: any
}

export interface IOwnerTeamFriendlyNameAliasState {
  value: string
}

export default class OwnerTeamFriendlyNameAlias extends React.Component<
  IOwnerTeamFriendlyNameAliasProps,
  IOwnerTeamFriendlyNameAliasState
> {
  constructor(props: IOwnerTeamFriendlyNameAliasProps) {
    super(props)
    this.handleUserInput = this.handleUserInput.bind(this)
    this.state = {
      value: '',
    }
  }

  handleUserInput(event: any) {
    this.setState({
      value: event.target.value,
    })
    this.props.callback_function(event.target.value)
  }

  getErrorMessage = (value: string): string => {
    return value === ''
      ? `Input value cannot be empty. Actual length is ${value.length}.`
      : ''
  }

  public render() {
    return (
      <div>
        <TextField
          label="Owner Team Friendly Name"
          placeholder="e.g. Client FUN Engineering Team"
          onChange={this.handleUserInput}
          validateOnLoad={false}
          onGetErrorMessage={this.getErrorMessage}
          validateOnFocusOut
          aria-label="Owner Team Friendly Name"
          disabled={this.props.currentTeam !== undefined}
          required
          value={
            this.props.currentTeam
              ? this.props.currentTeam.ownerTeamFriendlyName
              : this.state.value
          }
        />
      </div>
    )
  }
}
