import { Dropdown, IDropdownOption, Separator, TextField } from "@fluentui/react";
import * as React from "react";
import { TeamConfig } from '../../../models/config.model';
import { TeamDetails } from './TeamDetails';
import { largeTitle } from '../ConfigPage';
export interface OwnershipSectionProps {
    children?: React.ReactNode
}

export interface OwnershipSectionState {
    teamConfigs: TeamConfig[];
    loading: boolean;
    selectedTeam?: TeamConfig;
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
            selectedTeam: undefined,
        }
    }

    /**
     * Prior to rendering the component, load up team configs from backend
     */
    componentDidMount() {
        this.populateTeamConfigData();
    }

    // required render method
    render(): React.ReactElement {
        let contents = this.state.loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
            this.renderContent()
        );
        return (
            <div>
              <Separator theme={largeTitle}>Ownership</Separator>
              {contents}
            </div>
        );
    }

    // helper methods
    renderContent() {
        return (
            <div>

                {/* User selects from a list of teams that have been created. Otherwise creates a new team */}
                <Dropdown
                    label="Team"
                    placeholder="Select a Team"
                    options={this.getTeamNames()}
                    required
                    onChange={this.onChange}
                    aria-label="Select a Team"
                />

                <TeamDetails currentTeam={this.state.selectedTeam} />

            </div>
        )

    }
    onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<TeamName> | undefined): void => {
        this.setState(
            {
                selectedTeam: this.getTeamConfig(option?.key)
            });
    }

    getTeamConfig(id: string | number | undefined) {
        return this.state.teamConfigs.find(x => x.TeamID === id)
    }

    extractTeamName(item: TeamConfig) {
        return {
            key: item.TeamID,
            text: item.OwnerTeamFriendlyName
        };
    }

    getTeamNames(): IDropdownOption<TeamName>[] {
        let result = this.state.teamConfigs.map(this.extractTeamName);
        result.push(
            {
                key: "create new team",
                text: "create new team"
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
