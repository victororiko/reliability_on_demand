import { Dropdown, IDropdownOption, Separator, TextField } from "@fluentui/react";
import * as React from "react";
import { TeamConfig } from '../../models/config.model';
import { TeamDetails } from './TeamDetails';
import { largeTitle } from '../helpers/Styles';
import { MyDropdown } from '../helpers/MyDropdown';
import axios from "axios";


export interface TeamSectionProps {
    children?: React.ReactNode,
    printHello?: any
}

export interface TeamSectionState {
    teamConfigs: TeamConfig[];
    loading: boolean;
    selectedTeam?: TeamConfig;
}

interface TeamName {
    key: string,
    text: string
}

export default class TeamSection extends React.Component<TeamSectionProps, TeamSectionState> {

    // constructor 
    constructor(props: TeamSectionProps) {
        // required call
        super(props)
        // set initial state which will be used by render() 
        this.state = {
            teamConfigs: [],
            loading: true,
            selectedTeam: undefined,
        }


        this.onTeamSelected = this.onTeamSelected.bind(this);
    }

    /**
     * Prior to rendering the component, load up team configs from backend
     */
    componentDidMount() {
        axios.get("api/Data/GetAllTeamConfigs")
            .then(res => {
                console.table(res.data);
                this.setState({
                    teamConfigs: res.data,
                    loading: false
                })
            });
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
                <Separator theme={largeTitle}>Team</Separator>
                {contents}
            </div>
        );
    }

    // helper methods
    renderContent() {
        return (
            <div>
                {/* User selects from a list of teams that have been created. Otherwise creates a new team */}
                <MyDropdown
                    label="Team"
                    placeholder="Select a team"
                    data={this.state.teamConfigs}
                    enabled={true}
                    required={true}
                    useKey="TeamID"
                    showValueFor="OwnerTeamFriendlyName"
                    handleOptionChange={this.onTeamSelected}
                />
                <TeamDetails currentTeam={this.state.selectedTeam} />

            </div>
        )

    }
    onTeamSelected = (option?: IDropdownOption): void => {
        this.setState(
            {
                selectedTeam: this.getTeamConfig(option?.key)
            });
        this.props.printHello(this.state.selectedTeam);
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
