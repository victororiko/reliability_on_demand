import * as React from 'react';
import { TextField, Dropdown, IDropdownOption, PrimaryButton } from '@fluentui/react';
import { MyDatePicker } from '../helpers/MyDatePicker';
import { StudyConfig } from '../../models/config.model';

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
                value={props.currentStudy?.StudyName}
                disabled={props.currentStudy !== undefined}
            />

            
            <Dropdown
                placeholder="Select a frequency"
                label="Frequency"
                options={frequencies}
                selectedKey={props.currentStudy?.CacheFrequency+""}
                required
                disabled={props.currentStudy !== undefined}
                onChange={onFrequencyChange}
            /> 
           

            {/* <MyDatePicker
                defaultDate={new Date()}
                label={"Select an Start Date"}
            /> */}

            <MyDatePicker
                defaultDate={getDefaultExpiryDate(props.currentStudy)}
                label={"Select an Expiry Date"}
                disabled={props.currentStudy !== undefined}
            />

            {/* User selects from [14d] */}
            <Dropdown
                placeholder="Select an observation window"
                label="Observation window"
                options={getObservationWindows()}
                selectedKey={props.currentStudy?.ObservationWindowDays+""}
                disabled={props.currentStudy !== undefined}
                onChange={onObservationWindowChange}
            />
            
            <PrimaryButton text="Add"
            disabled={props.currentStudy !== undefined} 
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
        { key: '14', text: '14 days' },
    ]
}

// TODO always get a fresh list of frequencies from SQL 
const frequencies = 
[
    { key: '0', text: 'none' },
    { key: '1', text: 'hourly' },
    { key: '168', text: 'weekly' },
    { key: '12', text: 'every 12 hours' },
    { key: '24', text: 'every 24 hours' },
    { key: '72', text: 'every 3 days' },

]

const onFrequencyChange = (event: React.FormEvent<HTMLDivElement>, option?: any): void => {
    console.log(`frequency selected = ${option?.key}`);
}

const onObservationWindowChange = (event: React.FormEvent<HTMLDivElement>, option?: any): void => {
    console.log(`Observation Window selected = ${option?.key}`);
}
