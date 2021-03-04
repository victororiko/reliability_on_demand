import * as React from 'react';
import { Icon, Text, TextField } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();
export interface IStudySectionProps {
}

export function StudySection(props: IStudySectionProps) {
    return (
        <div>
            <TextField label="Study Name"
                required
                placeholder="e.g. WVD Study"
                aria-label="Study Name" />
        </div>
    );
}
