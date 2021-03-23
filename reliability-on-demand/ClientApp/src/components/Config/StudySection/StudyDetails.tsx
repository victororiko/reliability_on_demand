import * as React from 'react';
import { TextField, Dropdown, IDropdownOption } from '@fluentui/react';
import { MyDatePicker } from '../../helpers/MyDatePicker';
import { StudyConfig } from '../../../models/config.model';
import { S_IFCHR } from 'node:constants';

export interface IStudyDetailsProps {
    currentStudy?: StudyConfig;
}

export function StudyDetails(props: IStudyDetailsProps) {
    return (
        <div>
            <TextField label="Study Name"
                required
                placeholder="e.g. WVD Study"
                aria-label="Study Name"
                value={getStudyNamesOrDefault(props.currentStudy)}
            />

            {/* 
            <Dropdown
                placeholder="Select a frequency"
                label="Frequency"
                options={this.getCacheFrequencies()}
                required
            /> 
            */}

            {/* <MyDatePicker
                defaultDate={new Date()}
                label={"Select an Start Date"}
            /> */}

            <MyDatePicker
                defaultDate={getDefaultExpiryDate(props.currentStudy)}
                label={"Select an Expiry Date"}
            />

            {/* User selects from [14d] */}
            <Dropdown
                placeholder="Select an observation window"
                label="Observation window"
                options={getObservationWindows()}
            />
        </div>
    );
}

function getStudyNamesOrDefault(currentStudy?:StudyConfig): string
{
    if(currentStudy === undefined)
        return 'Please type in a Study';
    else
        return currentStudy.StudyName;

}

function getDefaultExpiryDate(currentStudy?:StudyConfig): Date {
    if(currentStudy === undefined)
    {
        var now = new Date();
        var current = new Date(now.getFullYear(), now.getMonth() + 3, now.getDay());
        return current;    
    }
    else {
        return new Date(currentStudy.Expiry);
    }
}

function getObservationWindows() {
    return [
        { key: '14 days', text: '14 days' },
    ]
}
