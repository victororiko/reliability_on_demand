import * as React from 'react';
import { Vertical, Pair, Pivot } from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { largeTitle } from '../helpers/Styles';
import { Label, Text, Separator, DetailsList, IColumn, Toggle, TooltipHost, Icon, buildColumns, ITooltipHostStyles } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { FailureSectionDetails } from '../FailureCurve/FailureSectionDetails';


initializeIcons();


export interface FailureSectionProps {
    studyid: number;
}

export interface FailureSectionState {
    verticals: Vertical[];
    loading: boolean;
    selectedVerticals?: Pair[];
    isButtonClicked: boolean;
    pivots: Pivot[];
    isSelectedVerticalSelected: boolean;
    hasPivotSelectionChanged: boolean;
    selectedPivots?: Pair[];
    selectedSourceSubType: string;
}


export default class FailureSection extends React.Component<FailureSectionProps, FailureSectionState> {

    selectedKeys: Array<Pair> = [];
    selectedPivots: Array<Pair> = [];
    cols: Array<IColumn> = [];
    studyPivotsData: Pivot[] = [];

    constructor(props: FailureSectionProps) {
        super(props)
        this._alertClicked = this._alertClicked.bind(this);

        this.state = {
            verticals: [],
            loading: true,
            selectedVerticals: [],
            isButtonClicked: false,
            pivots: [],
            isSelectedVerticalSelected: false,
            hasPivotSelectionChanged: false,
            selectedPivots: [],
            selectedSourceSubType: '',
        }


    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        this.populateVerticalData();
    }

    buildColumnArray() {
        this.cols = buildColumns(this.studyPivotsData);
    }

    async populateVerticalData() {
        const response = await fetch("api/Data/GetAllMainVertical");
        const data = await response.json();
        this.setState({ verticals: data, loading: false });
    }

    render(): React.ReactElement {


        let verticals = this.state.loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
            this.renderVerticals()
        );

        let selectedVerticals = ((this.selectedKeys != null && this.selectedKeys.length > 0) ? this.renderSelectedVerticals() : '');

        let failureDetailButton = this.renderFailureDetailsButton();

        let ConfigureButtonClicked = (this.state.isButtonClicked == true ? this.onConfigureVerticalButtonClicked() : '');

        return (
            <div>
                <Separator theme={largeTitle}>Failure Vertical Section</Separator>
                {verticals}
                {selectedVerticals}
                {failureDetailButton}
                {ConfigureButtonClicked}
            </div>
        );
    }

    renderFailureDetailsButton() {
        return (
            <div>
                <TooltipHost
                    content="Press this button if all the required verticals are selected and you would like to configure them one by one"
                >
                    <DefaultButton text="Configure Failure Curve" onClick={this._alertClicked} allowDisabledFocus disabled={false} checked={false} />
                </TooltipHost>
            </div>
        );
    }

    renderSelectedVerticals() {
        return (
            <div>
                <TooltipHost
                    content="List of verticals you selected to configure for your study"
                >
                <Label>
                    Selected Vertical
                    </Label>
                </TooltipHost>
                    {this.selectedKeys.map(key => (<Text block>{key.text}</Text>))}

            </div>
        );
    }

    renderVerticals() {

        return (
            <div>
                <TooltipHost
                    content="Select all the verticals you would like to configure for your study"
                >
                <Dropdown
                    placeholder="Select Verticals"
                    label="Select Verticals"
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={this.onVerticalSelected}
                    multiSelect options={this.getVerticalNames()}

                    />
                </TooltipHost>
            </div>
        );
    }


    onVerticalSelected?= (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {

        if (option) {
            let updated = option.selected ? [...this.state.selectedVerticals ?? [], option as Pair] : this.state.selectedVerticals?.filter(val => val.text !== option.text);

            this.setState({
                selectedVerticals: updated
            });
            this.onVerticalSelectionChangeText(updated);
        }

    }

    onVerticalSelectionChangeText(input: any) {
        if (input)
            this.selectedKeys = input;
    }


    extractVerticalName(item: Vertical) {
        var p: Pair = ({
            key: item.PivotSourceSubType,
            text: item.VerticalName
        });

        return p;
    }

    getVerticalNames(): IDropdownOption<Pair>[] {
        let result = this.state.verticals.map(this.extractVerticalName);
        return result;
    }

    _alertClicked() {
        this.setState({ isButtonClicked: true });
    }


    onConfigureVerticalButtonClicked() {

        return (
            <div>
                <FailureSectionDetails studyid={this.props.studyid} selectedVerticalsForStudy={this.selectedKeys} />
            </div>
        );
    }

}
