import * as React from 'react';
import { Dropdown, Text, TextField } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();
export interface IOwnershipSectionProps {
}



export function OwnershipSection(props: IOwnershipSectionProps) {
    return (
        <div>

            {/* User selects from [Build, Branch, Revision, OEM Model, OEM, Processor...] */}
            <Dropdown
                label="Team"
                placeholder="Select a Team"
                options={getTeams()}
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
function getTeams(): import("@fluentui/react").IDropdownOption<any>[] {
    return [
        { key: 'Team1', text: 'Team1' },
        { key: 'Team2', text: 'Team2' },
        { key: 'Team3', text: 'Team3' },
        { key: 'Team4', text: 'Team4' },
        { key: 'Team5', text: 'Team5' },
    ]
}

