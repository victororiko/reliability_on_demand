import { Dropdown, IDropdownOption, TextField } from "@fluentui/react";
import * as React from "react";
import { TeamConfig } from '../../../models/config.model';

export interface OwnershipSectionProps {
    children?: React.ReactNode
}

export interface OwnershipSectionState {
    teamNames: TeamConfig[];
    loading: boolean;
}

export default class OwnershipSection extends React.Component<OwnershipSectionProps, OwnershipSectionState> {

    constructor(props: OwnershipSectionProps) {
        // required call
        super(props)
        // set initial state which will be used by render() 
        this.state = {
            teamNames: [],
            loading: true,
        }
    }

    getTeamNames(){
        let container:IDropdownOption;
        this.state.teamNames.map(item => {

            container["key"] = item.OwnerTeamFriendlyName;
            container["text"] = item.OwnerTeamFriendlyName;

            return container;
        });

        return [
            { key: 'Team1', text: 'Team1' },
            { key: 'Team2', text: 'Team2' },
            { key: 'Team3', text: 'Team3' },
            { key: 'Team4', text: 'Team4' },
            { key: 'createNew', text: 'Create a New Team' },
        ]
    }

    render() {
        return (
            <div>

                {/* User selects from a list of teams that have been created. Otherwise creates a new team */}
                <Dropdown
                    label="Team"
                    placeholder="Select a Team"
                    options={this.getTeamNames()}
                    required
                    aria-label="Select a Team"
                />

                <TextField label="Owner contact (alias)"
                    required
                    placeholder="e.g. karanda"
                    aria-label="Owner contact (alias)" />

                <TextField label="Owner Team Friendly Name"
                    required
                    placeholder="e.g. Client FUN"
                    aria-label="Owner Team Friendly Name" />

                <TextField label="Owner Triage (alias)"
                    required
                    placeholder="e.g. cosreldata"
                    aria-label="Owner Triage (alias)" />

                <TextField label="Compute Resource Location"
                    placeholder="e.g. Data Bricks or Cosmos location"
                    aria-label="Compute Resource Location" />
            </div>
        )
    }

    async populateConfigData() {
        const response = await fetch("api/Data/GetAllTeamConfigs");
        const data = await response.json();
        this.setState({ teamNames: data, loading: false });
      }
}
