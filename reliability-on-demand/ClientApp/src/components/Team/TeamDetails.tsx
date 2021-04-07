import { PrimaryButton, TextField } from '@fluentui/react';
import * as React from 'react';
import { TeamConfig } from '../../models/config.model';

export interface ITeamDetailsProps {
    currentTeam?: TeamConfig;
}

export function TeamDetails(props: ITeamDetailsProps) {
    return (
        <div>
            <TextField label="Owner contact (alias)"
                required
                placeholder="e.g. karanda"
                value={props.currentTeam?.OwnerContact}
                aria-label="Owner contact (alias)"
                disabled={props.currentTeam !== undefined}
            />

            <TextField label="Owner Team Friendly Name"
                required
                placeholder="e.g. Client FUN"
                value={props.currentTeam?.OwnerTeamFriendlyName}
                aria-label="Owner Team Friendly Name"
                disabled={props.currentTeam !== undefined}
            />

            <TextField label="Owner Triage (alias)"
                required
                placeholder="e.g. cosreldata"
                value={props.currentTeam?.OwnerTriageAlias}
                aria-label="Owner Triage (alias)"
                disabled={props.currentTeam !== undefined}
            />

            <TextField label="Compute Resource Location"
                placeholder="e.g. Data Bricks or Cosmos location"
                aria-label="Compute Resource Location"
                disabled={props.currentTeam !== undefined}
            />

            <PrimaryButton text="Add"
                disabled={props.currentTeam !== undefined}
                onClick={(x) => console.log(`Added Team - ${JSON.stringify(x)}`) }
            />

        </div>
    );
}
