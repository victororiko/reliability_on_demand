import { Dropdown, IDropdownOption, TextField } from "@fluentui/react";
import * as React from "react";
import { TeamConfig } from '../../../models/config.model';

export interface OwnershipSectionProps {
    children?: React.ReactNode
}

export interface OwnershipSectionState {
    teamConfigs: TeamConfig[];
    loading: boolean;
}

interface TeamName {
    key: string,
    text: string
}

export default class OwnershipSection extends React.Component<OwnershipSectionProps, OwnershipSectionState> {

    // constructor 
    constructor(props: OwnershipSectionProps) {
        // required call
        super(props)
        // set initial state which will be used by render() 
        this.state = {
            teamConfigs: [],
            loading: true,
        }
    }

    /**
     * Prior to rendering the component, load up team configs from backend
     */
     componentDidMount() {
        this.populateTeamConfigData();
    }

    // required render method
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

    // helper methods
    extractTeamName(item: TeamConfig) {
        return { 
            key: item.ConfigID, 
            text: item.OwnerTeamFriendlyName 
        };
    }

    getTeamNames(): IDropdownOption<TeamName>[] {
        let result = this.state.teamConfigs.map(this.extractTeamName);
        result.push(
            {
                key:"create new team",
                text:"create new team"
            }
        )
        return result;
    }  

    async populateTeamConfigData() {
        const response = await fetch("api/Data/GetAllTeamConfigs");
        const data = await response.json();
        this.setState({ teamConfigs: data, loading: false });
    }
}
