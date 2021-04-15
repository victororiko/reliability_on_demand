import { TextField } from '@fluentui/react';
import * as React from 'react';
import { TeamConfig } from '../../models/config.model';

export interface IOwnerContactAliasProps {
    currentTeam?: TeamConfig;
}

export interface IOwnerContactAliasState {
    value: string;
}

export default class OwnerContactAlias extends React.Component<IOwnerContactAliasProps, IOwnerContactAliasState> {
    constructor(props: IOwnerContactAliasProps) {
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this)
        this.state = {
            value: ''
        }
    }

    handleUserInput(event: any) {
        this.setState(
            {
                value: event.target.value
            }
        )
    }

    getErrorMessage = (value: string): string => {
        return value === ''  ? `Input value cannot be empty. Actual length is ${value.length}.` : '';
    };

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
                />
            </div>
        );
    }


}
