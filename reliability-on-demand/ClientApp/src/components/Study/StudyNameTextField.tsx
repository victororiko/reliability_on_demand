import React from 'react'
import { TextField } from '@fluentui/react';
import { StudyConfig } from '../../models/config.model';
interface Props {
    currentStudy?: StudyConfig;
    callBack:any;
}

export const StudyNameTextField = (props: Props) => {
    const [textFieldValue, setTextFieldValue] = React.useState('');
    const handleTextInput = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setTextFieldValue(newValue || '');
            props.callBack(newValue);
        },
        [props],
    );

    const getSelectedKey = (currentStudy: StudyConfig | undefined) => {
        if (currentStudy) {
            return currentStudy?.StudyName;
        }
        else
            return textFieldValue;
    }

    return (
        
        <TextField label="Study Name"
            required
            placeholder="e.g. WVD Study"
            aria-label="Study Name"
            value={getSelectedKey(props.currentStudy)}
            onChange={handleTextInput}
            disabled={props.currentStudy !== undefined}
        />
        
    )
}
