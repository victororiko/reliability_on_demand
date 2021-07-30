import * as React from 'react';
import { Vertical, Pair, Pivot, PivotSelection, FailureConig } from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { largeTitle } from '../helpers/Styles';
import { Label, Text, Separator, DetailsList, IColumn, Toggle, TooltipHost, Icon, buildColumns } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { FailureSectionDetails } from '../FailureCurve/FailureSectionDetails';
import axios from 'axios';


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



    /*
    getSelectedKeys() {
        var options = this.selectedKeys;
        var placeholder: Pair = {
            key: "Select Vertical",
            text: "Select Vertical"
        }
        options.push(placeholder);
        return options;
    }

    onSelectingSelectedVertical = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

        if (item.key == "Select Vertical")
            return;

        var sourcesubtype = item.key;
        this.setState({ isSelectedVerticalSelected: true });
        this.setState({ selectedSourceSubType: sourcesubtype.toString() });
        this.populatePivotsData(sourcesubtype);
    }


     async populatePivotsData(sourcetype: any) {
         var d = JSON.stringify(sourcetype);

         await axios.post("api/Data/GetAllailurePivotNamesForAVertical", d,{
             headers: {
                 'Content-Type': 'application/json'
             }})
            .then(res => {
                console.log(res.data);
                this.setState({ pivots: res.data })
            }).catch((err) => {
                console.log('Axios Error:', err.message);

            })

         this.onPivotDropdownLoad();

    }

    renderPivots() {

        return (

            <div>
                <Separator theme={largeTitle}>Failure Aggregation Configuration</Separator>
                <Dropdown
                    placeholder="Select Pivot"
                    label="Select Pivot"
                    onChange={this.onSelectingPivot}
                    // eslint-disable-next-line react/jsx-no-bind
                    multiSelect options={this.getPivotNames()}

                />
            </div>
        );
    }


    extractPivotName(item: Pivot) {
        return {
            key: item.PivotID,
            text: item.PivotSourceColumnName
        };
    }

    getPivotNames(): IDropdownOption<Pivot>[] {

        if (this.state.pivots != null && this.state.pivots.length > 0) {
            let result = this.state.pivots.map(this.extractPivotName);
            return result;
        }

        return [];
    }

    onSelectingPivot = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

        this.setState({ hasPivotSelectionChanged: true });

        if (item) {
            let updated = item.selected ? [...this.state.selectedPivots ?? [], item as Pair] : this.state.selectedPivots?.filter(val => val.key !== item.key);

            this.setState({
                selectedPivots: updated
            });
            this.onPivotSelectionChangeText(updated);
        }

    }

    onPivotSelectionChangeText(input: any) {
        if (input)
            this.selectedPivots = input;
    }

    renderPivotTable() {

        this.buildColumnArray();

        return (
            <DetailsList
                items={this.studyPivotsData}
                setKey="set"
                columns={this.cols}
                onRenderItemColumn={this._renderItemColumn}
                onItemInvoked={this._onItemInvoked}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
            />
        );
    }


    private _onItemInvoked(item: any, index: number | undefined): void {
        alert(`Item ${item.name} at index ${index} has been invoked.`);
    }


    _renderItemColumn(item: Pair, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName as keyof Pair] as string;

        if (column.key != 'Pivot') {
            return (
                <span><Toggle
                    label={
                        <div>
                            Custom inline label{' '}
                            <TooltipHost content="Info tooltip">
                                <Icon iconName="Info" aria-label="Info tooltip" />
                            </TooltipHost>
                        </div>
                    }
                    inlineLabel
                    onText="On"
                    offText="Off"
                    
                /></span>
            );
        }
        else
            return <span>{fieldContent}</span>;
    }

    _onChange(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
    console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
}

    
    
     async onPivotDropdownLoad() {

         var input: FailureConig = {
             StudyID: this.props.studyid,
             PivotSourceSubType: this.state.selectedSourceSubType,
             Pivots:[],
         };

         await axios.post("api/Data/GetAllConfiguredFailurePivotsForAVertical", input, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res.data);
                this.studyPivotsData = res.data;
            }).catch((err) => {
                console.log('Axios Error:', err.message);

            })

         if (this.studyPivotsData == null || this.studyPivotsData.length == 0) {
             await axios.post("api/Data/GetAllDefaultFailurePivotsForAVertical", input, {
                 headers: {
                     'Content-Type': 'application/json'
                 }
             })
                 .then(res => {
                     console.log(res.data);
                     this.studyPivotsData = res.data;
                 }).catch((err) => {
                     console.log('Axios Error:', err.message);

                 })
         }
    }
    */


}
