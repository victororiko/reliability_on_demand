import { DefaultButton } from '@fluentui/react';
import * as React from 'react';
import { FailureConfig } from '../../models/FailureConfig.model';
import axios from 'axios';
// Our components that make up the page


export interface IFailureCurveSaveProps {
    failureConfigToSave: FailureConfig;
}

export interface IFailureCurveSaveState {
    hasSavedFailureCurve: boolean,
}

export class FailureCurveSave extends React.Component<IFailureCurveSaveProps, IFailureCurveSaveState> {
    constructor(props: IFailureCurveSaveProps) {
        super(props);
        this._saveClicked = this._saveClicked.bind(this);
    }

    componentDidMount() {
        this.setState({
            hasSavedFailureCurve : false,
        })
    }

    render() {
        return (
            <div>
                <DefaultButton text="Save Config" onClick={this._saveClicked} allowDisabledFocus disabled={false} checked={false} />
            </div>
        );
    }


    async _saveClicked() {

        axios.post('api/Data/UpdateFailureSavedConfig', this.props.failureConfigToSave
        )
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    
}

