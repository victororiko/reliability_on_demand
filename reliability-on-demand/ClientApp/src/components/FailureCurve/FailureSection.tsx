import * as React from 'react';
import { Vertical, Pair, Pivot } from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { largeTitle } from '../helpers/Styles';
import { Label, Text, Separator, DetailsList, IColumn, Toggle, TooltipHost, Icon, buildColumns } from "@fluentui/react";
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
    selectedPivotTableAttrs: PivotSelection[];
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
            selectedPivotTableAttrs: [],
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
                <DefaultButton text="Configure Failure Curve" onClick={this._alertClicked} allowDisabledFocus disabled={false} checked={false} />
            </div>
        );
    }

    renderSelectedVerticals() {
        return (
            <div>
                <Label>
                    Selected Vertical
            </Label>
                { this.selectedKeys.map(key => (<Text block>{key.text}</Text>))}
            </div>
        );
    }

    renderVerticals() {

        return (
            <div>
                <Dropdown
                    placeholder="Select Verticals"
                    label="Select Verticals"
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={this.onVerticalSelected}
                    multiSelect options={this.getVerticalNames()}

                />

            </div>
        );
    }


    onVerticalSelected = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

        if (item) {
            let updated = item.selected ? [...this.state.selectedVerticals ?? [], item as Pair] : this.state.selectedVerticals?.filter(val => val.text !== item.text);

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
        return {
            key: item.PivotSourceSubType,
            text: item.VerticalName
        };
    }

    getVerticalNames(): IDropdownOption<Vertical>[] {
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
