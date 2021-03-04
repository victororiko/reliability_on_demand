import * as React from 'react';
import { Icon, Text, TextField } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();
export interface IOwnershipProps {
}

export function Ownership(props: IOwnershipProps) {
    return (
        <div>
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
