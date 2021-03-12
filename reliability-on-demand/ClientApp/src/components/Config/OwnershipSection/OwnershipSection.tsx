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

    constructor(props: OwnershipSectionProps) {
        // required call
        super(props)
        // set initial state which will be used by render() 
        this.state = {
            teamConfigs: [],
            loading: true,
        }
    }

    extractTeamName(item: TeamConfig) {
        return { 
            key: item.ConfigID, 
            text: item.OwnerTeamFriendlyName 
        };
    }

    getTeamNamesOffline(): IDropdownOption<TeamName>[] {
        var sampleTeamConfigs = this.getTeamConfigsOffline();
        const result = sampleTeamConfigs.map(this.extractTeamName);
        return result;
    }

    getTeamNames(): IDropdownOption<TeamName>[] {
        const result = this.state.teamConfigs.map(this.extractTeamName);
        return result;
    }    

    componentDidMount() {
        this.populateTeamConfigData();
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

    async populateTeamConfigData() {
        const response = await fetch("api/Data/GetAllTeamConfigs");
        const data = await response.json();
        this.setState({ teamConfigs: data, loading: false });
    }

   
    getTeamConfigsOffline(): TeamConfig[] {
        return [
            {
                "ConfigID": "df560f74-8fc3-42a0-8eaf-23a7768dba03",
                "OwnerContact": "dishah",
                "OwnerTeamFriendlyName": "Client Fun Team 2",
                "OwnerTriageAlias": "cosreldata"
            },
            {
                "ConfigID": "7d0c1601-c42d-464d-a631-260e26ee636f",
                "OwnerContact": "karanda",
                "OwnerTeamFriendlyName": "Data sub team",
                "OwnerTriageAlias": "cosreldata"
            },
            {
                "ConfigID": "a5f258e2-1cfd-45ad-bbdf-421f59b023fd",
                "OwnerContact": "rajroy",
                "OwnerTeamFriendlyName": "Client Fun Team 3",
                "OwnerTriageAlias": "cosreldata"
            },
            {
                "ConfigID": "82099526-633d-467b-9a41-f9fb38bcee27",
                "OwnerContact": "karanda",
                "OwnerTeamFriendlyName": "Client Fun Team 1",
                "OwnerTriageAlias": "osgreldev"
            }
        ]
    }
}
