import * as React from 'react';
import { Pair, Pivot, FailureConfig, PivotTable, PivotSQLResult} from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
//import { largeTitle } from '../helpers/Styles';
import { buildColumns, IColumn, DetailsList, Checkbox, SelectionMode, TextField, DefaultButton } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { FailureCurveSave } from '../FailureCurve/FailureCurveSave';
import axios from 'axios';
initializeIcons();


export interface IFailurePivotsConfigureProps {
    studyid: number;
    selectedVerticalForStudy: Pair;
}

export interface IFailurePivotsConfigureState {
    loading: boolean;
    pivotsList: Pivot[];
    hasPivotSelectionChanged: boolean;
    selectedPivots: Pair[];
    selectedPivotsOnlyKey: number[];
    isFilterExpValid: boolean;
}

export class FailurePivotsConfigure extends React.Component<IFailurePivotsConfigureProps, IFailurePivotsConfigureState> {

    cols: IColumn[] = [];
    configuredPivots: Pivot[] = [];
    requiredPivotTableData: PivotTable[] = [];
    resultantPivotSQL: PivotSQLResult[] = [];


    constructor(props: any) {
        super(props)

        this.state = ({
            loading: true,
            pivotsList: [],
            hasPivotSelectionChanged: false,
            selectedPivots: [],
            selectedPivotsOnlyKey: [],
            isFilterExpValid: true,
        })

        this.onSelectingPivot = this.onSelectingPivot.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this._renderItemColumn = this._renderItemColumn.bind(this);
        this.getDefaultPivotKeys = this.getDefaultPivotKeys.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this._validateClicked = this._validateClicked.bind(this);
    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        this.onPivotDropdownLoad();
        this.populateData();
    }

    buildColumnArray() {
        var arr = buildColumns(this.requiredPivotTableData);

        for (let ele of arr) {
            if (ele.fieldName != 'PivotID' && ele.fieldName != 'PivotScopeID')
                this.cols.push(ele);
        }
    }

    async populateData() {

        var d = JSON.stringify(this.props.selectedVerticalForStudy.key);

            await axios.post("api/Data/GetAllailurePivotNamesForAVertical", d, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    console.log(res.data);
                    this.setState({ pivotsList: res.data })
                }).catch((err) => {
                    console.log('Axios Error:', err.message);

                })

        this.setState({ loading: false });
    }

    getDefaultPivotKeys() {
        this.setState({
            selectedPivots: this.resultantPivotSQL.map(this.extractPivotPair),
            selectedPivotsOnlyKey: this.extractPivotIDs(this.resultantPivotSQL),
        });
    }

    extractPivotIDs(arr: PivotSQLResult[]) {
        let res: number[] = [];

        for (let ele of arr) {
            res.push(ele.PivotID);
        }

        return res;
    }

    extractPivotPair(item: PivotSQLResult) {

        let res: Pair = {
            key: item.PivotID.toString(),
            text: item.PivotSourceColumnName
        };

        return res;
    }

    onSelectingPivot = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

        this.setState({ hasPivotSelectionChanged: true });

        if (item) {
            let keyUpdated = item.selected ? [...this.state.selectedPivotsOnlyKey ?? [], item.key as number] : this.state.selectedPivotsOnlyKey?.filter(val => val !== item.key);
            let updated: Pair[] = [];

            for (let p of this.state.selectedPivots) {
                var flag = false;
                for (let k of keyUpdated) {
                    if (parseInt(p.key) == k) {
                        flag = true;
                        break;
                    }
                }

                if (flag == true)
                    updated.push(p);
            }

            this.setState({
                selectedPivots: updated,
                selectedPivotsOnlyKey: keyUpdated,
            });

            this.updatePivotTableData(updated);
           
        }

    }

    checkboxChange = (ev?: React.FormEvent<HTMLInputElement>, checked?: boolean): void => {

        var target = (ev?.target.id).toString();

        var arr = target.split('_');

        var row = parseInt(arr[0]), col = arr[1];

        this.requiredPivotTableData[row][col] = checked;

        // ev?.preventDefault();
        this.forceUpdate();

    }

    handleChange = (ev?: React.FormEvent<HTMLInputElement>, newValue?: string): void => {
        var target = (ev?.target.id).toString();
        var arr = target.split('_');

        var row = parseInt(arr[0]), col = arr[1];

        this.requiredPivotTableData[row][col] = newValue;

        this.setState({
            isFilterExpValid: false,
        });

        this.forceUpdate();
    }

    updatePivotTableData(input: Pair[]) {
        var updated: PivotTable[] = [];

        for (let ele of this.requiredPivotTableData) {
            for (let e of input) {
                if (ele.PivotID == parseInt(e.key)) {
                    updated.push(ele);
                    break;
                }
            }
        }

        var flag: boolean = false;

        for (let ele of input) {

            flag = false;

            for (let e of updated) {
                if (parseInt(ele.key) == e.PivotID) {
                    flag = true;
                }
            }

            if (flag == false) {
                var item: PivotTable = { PivotID: parseInt(ele.key), PivotName: ele.text, IsApportionJoinPivot: false, IsApportionPivot: false, IsKeyPivot: false, IsScopeFilter: false, IsSelectPivot: false, FilterExpression: '', FilterExpressionOperator: '', PivotScopeID : 0 };
                updated.push(item);
            }

        }

        this.requiredPivotTableData = updated;
    }


    render(): React.ReactElement {

        this.cols = [];
        this.buildColumnArray();

        let pivottable = (
            <DetailsList
                items={(this.requiredPivotTableData)}
                setKey="set"
                columns={this.cols}
                onRenderItemColumn={this._renderItemColumn}
                selectionMode={SelectionMode.none}
            />
        );

         let pivotdropdown = (

            <div>

                <Dropdown
                    placeholder="Select Pivots"
                    label="Select Pivots"
                    // eslint-disable-next-line react/jsx-no-bind
                     onChange={this.onSelectingPivot}
                     multiSelect options={this.getPivotNames(this.state.pivotsList)}
                     selectedKeys={this.state.selectedPivotsOnlyKey}
                />
            </div>
        );


        let validatebutton = (<div>
            <DefaultButton text="Validate Filter Expression" onClick={this._validateClicked} allowDisabledFocus disabled={false} checked={false} />
        </div>);

        let saveButton = (this.state.isFilterExpValid == true ? this.renderSaveButton() : '');

        return (<div>
            {pivotdropdown}
            {pivottable}
            {validatebutton}
            {saveButton}
        </div>);

    }

    renderSaveButton() {

        var failureObjToBePassed: FailureConfig = {
            StudyID: this.props.studyid,
            PivotSourceSubType: this.props.selectedVerticalForStudy.key,
            Pivots: this.requiredPivotTableData,
        };

        //Pivots: this.requiredPivotTableData,

        return (

            <div>
                <FailureCurveSave failureConfigToSave={failureObjToBePassed} />  
            </div>
        );
    }


    //azure function to validate filter expression
    async _validateClicked() {

        var input = {
            name: this.requiredPivotTableData
        };

        await axios.post("https://riodfilterexpressionvalidator.azurewebsites.net/api/FailureFilterExpressionValidator?code=9s1D9YClMGI4Fwb0JcKufQtOG2sJTDhbtSiVj8YCEFJKDWLZZrZZog==", input, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res.data);
                this.setState({ isFilterExpValid: res.data });
            }).catch((err) => {
                console.log('Axios Error:', err.message);

            })
            
    }


    extractPivotName(item: Pivot) {
        return {
            key: item.PivotID,
            text: item.PivotSourceColumnName
        };
    }

    getPivotNames(input: Pivot[]): IDropdownOption<Pair>[] {

        if (input != null && input.length > 0) {
            let result = input.map(this.extractPivotName);
            return result;
        }

        return [];
    }

    
    getRequiredSchemaForPivotTable() {

        for (let ele of this.resultantPivotSQL) {
            var item: PivotTable = {
                PivotID: ele.PivotID,
                PivotName: ele.PivotSourceColumnName,
                IsApportionJoinPivot: (ele.smap[0].IsApportionJoinColumn == null ? false : ele.smap[0].IsApportionJoinColumn),
                IsApportionPivot: (ele.smap[0].IsApportionColumn == null ? false : ele.smap[0].IsApportionColumn),
                IsKeyPivot: (ele.smap[0].IsKeyColumn == null ? false : ele.smap[0].IsKeyColumn),
                IsSelectPivot: (ele.smap[0].IsSelectColumn == null ? false : ele.smap[0].IsSelectColumn),
                IsScopeFilter: (ele.smap[0].PivotScopeID != null ? true : false),
                PivotScopeID: ele.smap[0].PivotScopeID,
                FilterExpression: ele.smap[0].scope[0].PivotScopeValue,
                FilterExpressionOperator: ele.smap[0].scope[0].PivotScopeOperator
            }
            this.requiredPivotTableData.push(item);
        }

    }

    
    async onPivotDropdownLoad() {

        var input: FailureConfig = {
            StudyID: this.props.studyid,
            PivotSourceSubType: this.props.selectedVerticalForStudy.key,
            Pivots: [],
        };

        await axios.post("api/Data/GetAllConfiguredFailurePivotsForAVertical", input, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res.data);
                this.resultantPivotSQL = res.data;
            }).catch((err) => {
                console.log('Axios Error:', err.message);

            })

        if (this.resultantPivotSQL == null || this.resultantPivotSQL.length == 0) {
            await axios.post("api/Data/GetAllDefaultFailurePivotsForAVertical", input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    console.log(res.data);
                    this.resultantPivotSQL = res.data;
                }).catch((err) => {
                    console.log('Axios Error:', err.message);

                })
        }

        this.getRequiredSchemaForPivotTable();
        this.getDefaultPivotKeys();
    }

    _renderItemColumn(item: Pair, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName as keyof Pair] as string;

        if (column.key == 'PivotID')
            return null;
        else if (column.key == 'FilterExpression' || column.key == 'FilterExpressionOperator') {

            return (
                <span>
                    <TextField value={fieldContent} id={index + '_' + column.key} onChange={this.handleChange} />
                </span>
                );
        }
        else if (column.key != 'PivotName') {

            return (
                <span>
                    <Checkbox checked={Boolean(fieldContent)} id={index + '_' + column.key} onChange={this.checkboxChange} />
                </span>
            );
        }
        else
            return <span>{fieldContent}</span>;
    }

}

