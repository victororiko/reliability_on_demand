/* eslint-disable react/no-direct-mutation-state */
import * as React from 'react';
import { StudyConfig, ConfigInquiry } from '../../models/config.model';
import { Separator } from "@fluentui/react";
import { StudyComboBox } from './StudyComboBox';
import { StudyNameTextField } from './StudyNameTextField';
import { FrequencyDropdown } from './FrequencyDropdown';
import { ExpiryDatePicker } from './ExpiryDatePicker';
import { ObservationWindowDropdown } from './ObservationWindowDropdown';
import { AddStudyButton } from './AddStudyButton';
import axios from 'axios';
import { largeTitle } from '../helpers/Styles';
import { containerStackTokens } from '../helpers/Styles';
import { Stack } from '@fluentui/react';

export interface IStudySectionProps {
    children?: React.ReactNode,
    inquiry: ConfigInquiry
}
export interface IStudySectionState {
    studyConfigs: StudyConfig[];
    loading: boolean;
    inquiry: ConfigInquiry;
    selectedStudy?: StudyConfig;
    newStudy: StudyConfig;
}

export default class StudySection extends React.Component<IStudySectionProps, IStudySectionState> {
    
    constructor(props: any) {
        super(props)

        this.state = {
            studyConfigs: [],
            inquiry: this.props.inquiry,
            loading: true,
            selectedStudy: undefined,
            newStudy: {} as StudyConfig
        }
    }
    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        axios.post("api/Data/GetAllStudyConfigsForTeam", this.state.inquiry)
            .then(res => {
                this.setState({
                    studyConfigs: res.data,
                    loading: false
                })
            })
    }
    render() {
        let contents = this.state.loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
            this.renderStudies()
        );
        return (
            <div>
                <Separator theme={largeTitle}>Study</Separator>
                {contents}
            </div>
        );
    }
    renderStudies() {
        return (
            <Stack tokens={containerStackTokens}>
                <StudyComboBox data={this.state.studyConfigs} callBack={this.selectCurrentStudy} />
                <StudyNameTextField currentStudy={this.state.selectedStudy} callBack={this.setNewStudyName} />
                <FrequencyDropdown currentStudy={this.state.selectedStudy} callBack={this.setNewStudyFrequency}/>
                <ExpiryDatePicker currentStudy={this.state.selectedStudy} callBack={this.setNewStudyDate}/>
                <ObservationWindowDropdown currentStudy={this.state.selectedStudy} callBack={this.setNewStudyObservationWindow} />
                <AddStudyButton currentStudy={this.state.selectedStudy} callBack={this.addNewStudyToBackend} />
            </Stack>
        );
    }

    // helper methods
    // Study Selection
    selectCurrentStudy = (selection: string) => {
        this.setState({
            selectedStudy: this.getStudyFromString(selection)
        })
    }
    getStudyFromString(selection: string): StudyConfig | undefined {
        let parsedStudy = this.state.studyConfigs.find(element => element.StudyName === selection);
        return parsedStudy;
    }

    // New Study Creation
    // Set new study's name based on user's input
    setNewStudyName = (valueFromTextField: string) => {
        this.state.newStudy.StudyName = valueFromTextField;
    }

    setNewStudyFrequency = (frequencyFromDropdown: number) => {
        this.state.newStudy.CacheFrequency = frequencyFromDropdown;
    }

    setNewStudyDate = (dateFromDatePicker:Date) => {
        this.state.newStudy.Expiry = dateFromDatePicker;
    }

    setNewStudyObservationWindow = (selectionDays:number) => {
        this.state.newStudy.ObservationWindowDays = selectionDays;
    }

    addNewStudyToBackend = () => {
        // Validate new study first 
        // Study name check
        let name = this.state.newStudy.StudyName;
        let freq = this.state.newStudy.CacheFrequency;
        let exp = this.state.newStudy.Expiry;
        if(name === null || name === undefined || name === '')
            alert('please specify a Name for the study you are adding');
        // Frequency check
        else if(freq === null || freq === undefined)
            alert('please specify a Frequency for the study you are adding');
        // Expiry Date check
        else if(exp === null || exp === undefined)
            alert('please specify an Expiry Date for the study you are adding');

        else alert(`New Study to be added = \n${JSON.stringify(this.state.newStudy,null,4)}`)
    }
}