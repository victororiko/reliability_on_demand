import { PrimaryButton, TextField } from '@fluentui/react';
import * as React from 'react';
import { TeamConfig } from '../../models/config.model';
import { replacerFunc } from "../../components/helpers/utils";
import OwnerContactAlias from './OwnerContactAlias';
import OwnerTeamFriendlyName from './OwnerTeamFriendlyName';
import OwnerTraigeAlias from './OwnerTriageAlias';

export interface ITeamDetailsProps {
    currentTeam?: TeamConfig;
}

interface ITeamDetailsState {
    newTeam: TeamConfig;
}

export class TeamDetails extends React.Component<ITeamDetailsProps, ITeamDetailsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            newTeam:
            {
                TeamID: "-1",
                OwnerContact: "",
                OwnerTeamFriendlyName: "",
                OwnerTriageAlias: ""
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: any) {
        // takes the current inputed values from user and makes a call to DB with the TeamConfig
        alert(`Submit button was clicked! Result team = ${JSON.stringify(this.state.newTeam)}`);
        event.preventDefault();
        //(x) => console.log(`Added Team - ${JSON.stringify(x, replacerFunc)}`)
    }

    getOwnerStringFromUser = (value: string) => {
        this.state.newTeam.OwnerContact = value;
    }

    getOwnerTeamFrienclyNameFromUser = (value: string) => {
        this.state.newTeam.OwnerTeamFriendlyName = value;
    }
    getOwnerTriageAliasUser = (value: string) => {
        this.state.newTeam.OwnerTriageAlias = value;
    }

    render() {
        return (
            <div>
                <OwnerContactAlias
                    currentTeam={this.props.currentTeam}
                    callback_function={this.getOwnerStringFromUser}
                />
                <OwnerTeamFriendlyName
                    currentTeam={this.props.currentTeam}
                    callback_function={this.getOwnerTeamFrienclyNameFromUser}
                />
                <OwnerTraigeAlias 
                    currentTeam={this.props.currentTeam} 
                    callback_function={this.getOwnerTriageAliasUser}
                    />

                // optional section
                <TextField label="Compute Resource Location"
                    placeholder="e.g. Data Bricks or Cosmos location"
                    aria-label="Compute Resource Location"
                    disabled={this.props.currentTeam !== undefined}
                />

                <PrimaryButton text="Add"
                    disabled={this.props.currentTeam !== undefined}
                    onClick={this.handleSubmit}
                />

            </div>
        );
    }

}
