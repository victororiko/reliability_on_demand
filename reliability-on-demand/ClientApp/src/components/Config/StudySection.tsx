import * as React from 'react';
import { Dropdown, TextField } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
import { MyDatePicker } from '../helpers/MyDatePicker';
initializeIcons();
export interface IStudySectionProps {
}
const dropdownStyles = { dropdown: { width: 300 } };

function getFrequencies(){
    // TODO - create a service that makes all backend calls.
    return [
        { key: 'Once', text: 'Once' },
        { key: '12 hours', text: '12 hours'},
        { key: '24 hours', text: '24 hours' },
        { key: '3 days', text: '3 days' },
        { key: '7 days', text: '7 days' },
    ]
}

function getObservationWindows(){
    return [
        { key: '14 days', text: '14 days' },
    ]
}

export function StudySection(props: IStudySectionProps) {
    return (
        <div>
            <TextField label="Study Name"
                required
                placeholder="e.g. WVD Study"
                aria-label="Study Name" />

            {/* User selects from [once, 12 h/ 24 h/ 3 d/ 7d] */}
            <Dropdown
                placeholder="Select a frequency"
                label="Frequency"
                options=
                {getFrequencies()}
                required
                styles={dropdownStyles}
            />

            <MyDatePicker defaultDate={new Date()} label={"Select an Start Date"}/>

            {/* TODO - set the correct start date to be 3 months from today */}
            <MyDatePicker defaultDate={new Date()} label={"Select an Expiry Date"}/>

            {/* User selects from [once, 12 h/ 24 h/ 3 d/ 7d] */}
            <Dropdown
                placeholder="Select an observation window"
                label="Observation window"
                options=
                {getObservationWindows()}
                required
                styles={dropdownStyles}
            />
        </div>
    );
}
