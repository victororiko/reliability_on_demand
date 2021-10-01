import React from 'react'
import { PrimaryButton } from '@fluentui/react';
import { StudyConfig } from '../../models/config.model';

interface Props {
    currentStudy?: StudyConfig;
    callBack:any;
}

export const AddStudyButton = (props: Props) => {

    return (
            <PrimaryButton text="Add Study"
                onClick={props.callBack}
                allowDisabledFocus
                disabled={props.currentStudy !== undefined}
            />
    )
}

