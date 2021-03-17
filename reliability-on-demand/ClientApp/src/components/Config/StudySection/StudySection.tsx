import * as React from 'react';
import { StudyConfig } from '../../../models/config.model';
import { Dropdown, TextField } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
import { MyDatePicker } from '../../helpers/MyDatePicker';
initializeIcons();

export interface IStudySectionProps {
    children?: React.ReactNode
}

export interface IStudySectionState {
    // studyConfigs: StudyConfig[];
    // loading: boolean;
    // selectedStudy?: StudyConfig;
}

const dropdownStyles = { dropdown: { width: 300 } };

export default class StudySection extends React.Component<IStudySectionProps, IStudySectionState> {

    constructor(props: any) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (<div>
            <Dropdown
                placeholder="Select a Study"
                label="Study"
                options={this.getFrequencies()}
                required
                styles={dropdownStyles}
            />

            <TextField label="Study Name"
                required
                placeholder="e.g. WVD Study"
                aria-label="Study Name" />

            {/* User selects from [once, 12 h/ 24 h/ 3 d/ 7d] */}
            <Dropdown
                placeholder="Select a frequency"
                label="Frequency"
                options=
                {this.getFrequencies()}
                required
                styles={dropdownStyles}
            />

            <MyDatePicker defaultDate={new Date()} label={"Select an Start Date"} />

            <MyDatePicker defaultDate={this.getDefaultExpiryDate()} label={"Select an Expiry Date"} />

            {/* User selects from [14d] */}
            <Dropdown
                placeholder="Select an observation window"
                label="Observation window"
                options=
                {this.getObservationWindows()}
                styles={dropdownStyles}
            />
        </div>)
    }

    // helper methods
    // TODO - create a service that makes all backend calls.
    getFrequencies() {
        return [
            { key: 'Once', text: 'Once' },
            { key: '12 hours', text: '12 hours' },
            { key: '24 hours', text: '24 hours' },
            { key: '3 days', text: '3 days' },
            { key: '7 days', text: '7 days' },
        ]
    }

    getObservationWindows() {
        return [
            { key: '14 days', text: '14 days' },
        ]
    }

    getDefaultExpiryDate(): Date {
        var now = new Date();
        var current = new Date(now.getFullYear(), now.getMonth() + 3, now.getDay());
        return current;
    }
}
