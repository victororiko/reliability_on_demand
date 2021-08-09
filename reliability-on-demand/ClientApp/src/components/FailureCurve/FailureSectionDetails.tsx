import * as React from 'react';
import { Pair } from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { largeTitle } from '../helpers/Styles';
import {Separator } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { FailurePivotsConfigure } from '../FailureCurve/FailurePivotsConfigure';
initializeIcons();


export interface IFailureSectionDetailsProps {
    studyid: number;
    selectedVerticalsForStudy: Pair[];
}

export interface IFailureSectionDetailsState {
    loading: boolean;
    isVerticalSelected: boolean;
    selectedVertical: Pair;
}

export class FailureSectionDetails extends React.Component<IFailureSectionDetailsProps, IFailureSectionDetailsState> {

    selectedVerticalsWithPlaceHolder: Pair[] = [];

    constructor(props: any) {
        super(props)

        this.state = ({
            loading: true,
            isVerticalSelected: false,
            selectedVertical: { key: 'Select Vertical', text: 'Select Vertical' },
        })


        this.selectedVerticalsWithPlaceHolder = this.props.selectedVerticalsForStudy;
        this.selectedVerticalsWithPlaceHolder.push({ key: 'Select Vertical', text: 'Select Vertical' });
    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        this.populateData();
    }

    populateData() {
        this.setState({ loading: false });
    }

    render(): React.ReactElement {

        let verticalSection = (<div> <Dropdown
            label="Select Vertical"
            placeholder="Select Vertical"
            selectedKey={this.state.selectedVertical.key}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={this.onVerticalSelected}
            options={this.selectedVerticalsWithPlaceHolder}
        />
        </div>);

        let pivotSection = (this.state.isVerticalSelected == true ? this.renderPivots() : '');

        return (
            <div>
                {verticalSection}
                { pivotSection}
            </div>
        );
        
    }


    onVerticalSelected? = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption,index?: number): void => {

        if (item) {
            if (item.key == "Select Vertical")
                return;

            this.setState({
                isVerticalSelected: true,
                selectedVertical: { key: item.key.toString(), text: item.text },
            });
        }
    }

    renderPivots() {
        return (
            <div>
                <FailurePivotsConfigure studyid={this.props.studyid} selectedVerticalForStudy={this.state.selectedVertical} />
            </div>
        );
    }
    


}
