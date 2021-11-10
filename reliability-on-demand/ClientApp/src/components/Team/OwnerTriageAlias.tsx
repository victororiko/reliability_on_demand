import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/config.model'

export interface IOwnerTriageAliasProps {
  currentTeam?: TeamConfig
  callback_function: any
}

export interface IOwnerTriageAliasState {
  value: string
}

export default class OwnerTriageAlias extends React.Component<
  IOwnerTriageAliasProps,
  IOwnerTriageAliasState
> {
  constructor(props: IOwnerTriageAliasProps) {
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

  getErrorMessage = (value: string): string => value === '' ? `Input value cannot be empty. Actual length is ${value.length}.` : ''

  public render() {
    return (
      <div>
        <TextField
          label="Owner Triage (alias)"
          suffix="@microsoft.com"
          placeholder="e.g. cosreldata"
          onChange={this.handleUserInput}
          validateOnLoad={false}
          onGetErrorMessage={this.getErrorMessage}
          validateOnFocusOut
          aria-label="Owner contact (alias)"
          disabled={this.props.currentTeam !== undefined}
          required
          value={this.props.currentTeam? this.props.currentTeam.ownerTriageAlias : this.state.value}
        />
      </div>
    )
  }
}
