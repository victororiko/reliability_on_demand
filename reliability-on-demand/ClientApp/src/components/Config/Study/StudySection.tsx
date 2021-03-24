import * as React from 'react';
import { StudyConfig, ConfigInquiry } from '../../../models/config.model';
import { Dropdown, IDropdownOption, Separator } from "@fluentui/react";
import { initializeIcons } from '@uifabric/icons';
import { StudyDetails } from './StudyDetails';
import axios from 'axios';
import { largeTitle } from '../ConfigPage';
initializeIcons();

export interface IStudySectionProps {
    children?: React.ReactNode,
    inquiry: ConfigInquiry
}

export interface IStudySectionState {
    studyConfigs: StudyConfig[];
    loading: boolean;
    inquiry: ConfigInquiry;
    selectedStudy?: StudyConfig;
}

interface StudyName {
    key: string;
    text: string;
}


export default class StudySection extends React.Component<IStudySectionProps, IStudySectionState> {

    constructor(props: any) {
        super(props)

        this.state = {
            studyConfigs: [],
            inquiry: this.props.inquiry,
            loading: true,
            selectedStudy: undefined
        }
    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        axios.post("api/Data/GetAllStudyConfigsForTeam", this.state.inquiry)
            .then(res => {
                console.log(res);
                console.log(res.data);
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
            this.renderContent()
        );
        return (
            <div>
              <Separator theme={largeTitle}>Study</Separator>
              {contents}
            </div>
        );
    }

    renderContent() {
        return(
        <div>
            <Dropdown
                label="Study"
                placeholder="Select a Study"
                options={this.getStudieNames()}
                required
                onChange={this.onChange}
                ariaLabel="Select a Study"
            />

            <StudyDetails currentStudy={this.state.selectedStudy} />
        </div>
        );
    }

    // helper methods
    onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<StudyName> | undefined): void => {
        this.setState(
            {
                selectedStudy: this.getStudyConfig(option?.key)
            });
    }

    getStudyConfig(id: string | number | undefined) {
        return this.state.studyConfigs.find(x => x.StudyID === id)
    }

    extractStudyNames(item: StudyConfig) {
        return {
            key: item.StudyID,
            text: item.StudyName
        };
    }

    getStudieNames() {
        let result = this.state.studyConfigs.map(this.extractStudyNames);
        result.push(
            {
                key: "create new study",
                text: "create new study"
            }
        )
        return result;
    }


}
