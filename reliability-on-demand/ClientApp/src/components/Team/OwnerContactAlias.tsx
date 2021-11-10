import { TextField } from '@fluentui/react'
import * as React from 'react'
import { TeamConfig } from '../../models/config.model'

export interface IOwnerContactAliasProps {
  currentTeam?: TeamConfig
  callback_function: any
}

export interface IOwnerContactAliasState {
  value: string
}

export default class OwnerContactAlias extends React.Component<
  IOwnerContactAliasProps,
  IOwnerContactAliasState
> {
  constructor(props: IOwnerContactAliasProps) {
    super(props)
    this.state = {
      value: '',
    }
    this.handleUserInput = this.handleUserInput.bind(this)
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
          label="Owner contact (alias)"
          suffix="@microsoft.com"
          placeholder="e.g. johndoe"
          onChange={this.handleUserInput}
          validateOnLoad={false}
          onGetErrorMessage={this.getErrorMessage}
          validateOnFocusOut
          aria-label="Owner contact (alias)"
          disabled={this.props.currentTeam !== undefined}
          required
          value={this.props.currentTeam ? this.props.currentTeam.ownerContact : this.state.value}
        />
      </div>
    )
  }
}
