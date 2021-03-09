import * as React from 'react';
import { Dropdown, TagItemSuggestionBase, TextField, IDropdownOption } from '@fluentui/react';
import { TeamConfig } from '../../models/config.model';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();
export interface IOwnershipSectionProps {
}

export const OwnershipSection = (props: IOwnershipSectionProps) => {

    const [teams, setTeams] = React.useState(null);
    React.useEffect(() =>{
        async function populateTeamData() {
            const response = await fetch("api/Data/GetAllTeamConfigs");
            const data = await response.json();
            setTeams(data);
        }
        populateTeamData();
    }, [])


    function getTeamNames(): import("@fluentui/react").IDropdownOption<any>[] {
        // teams.map(item:TeamConfig => {
        //     let container:IDropdownOption;
        
        //     container["key"] = item.OwnerTeamFriendlyName;
        //     container["text"] = item.OwnerTeamFriendlyName;
        
        //     return container;
        // });

        return [
            { key: 'Team1', text: 'Team1' },
            { key: 'Team2', text: 'Team2' },
            { key: 'Team3', text: 'Team3' },
            { key: 'Team4', text: 'Team4' },
            { key: 'createNew', text: 'Create a New Team' },
        ]
    }
    return (
        <div>

            {/* User selects from a list of teams that have been created. Otherwise creates a new team */}
            <Dropdown
                label="Team"
                placeholder="Select a Team"
                options={getTeamNames()}
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
    );

}


