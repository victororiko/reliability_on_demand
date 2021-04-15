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
    newTeam?: TeamConfig;
}

export class TeamDetails extends React.Component<ITeamDetailsProps, ITeamDetailsState> {

    constructor(props: any) {
        super(props);
        this.state = { newTeam: this.props.currentTeam };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: any) {
        alert(`Add button was clicked! Result team = ${JSON.stringify(this.state.newTeam)}`);
        event.preventDefault();
        //(x) => console.log(`Added Team - ${JSON.stringify(x, replacerFunc)}`)
    }

    render() {
        return (
            <form onSubmit={ this.handleSubmit}>
                <OwnerContactAlias currentTeam={this.props.currentTeam}/>
                <OwnerTeamFriendlyName currentTeam={this.props.currentTeam}/>
                <OwnerTraigeAlias currentTeam={this.props.currentTeam}/>

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

            </form>
        );
    }

}
