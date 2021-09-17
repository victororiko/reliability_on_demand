import * as React from 'react';
import { Pair, Pivot, FailureConfig, PivotTable, PivotSQLResult } from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { buildColumns, IColumn, DetailsList, Checkbox, SelectionMode, TooltipHost } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { FailureCurveFilterExpression } from '../FailureCurve/FailureCurveFilterExpression';
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
    validateAZKey: string;
}

export class FailurePivotsConfigure extends React.Component<IFailurePivotsConfigureProps, IFailurePivotsConfigureState> {

    cols: IColumn[] = [];
    configuredPivots: Pivot[] = [];
    requiredPivotTableData: PivotTable[] = [];
    resultantPivotSQL: PivotSQLResult[] = [];

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            pivotsList: [],
            hasPivotSelectionChanged: false,
            selectedPivots: [],
            selectedPivotsOnlyKey: [],
            isFilterExpValid: true,
            validateAZKey: '',
        };

    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        this.onPivotDropdownLoad();
        this.populateData();
        this.onSelectingPivot = this.onSelectingPivot.bind(this);
        this.onChange = this.onChange.bind(this);
        this._renderItemColumn = this._renderItemColumn.bind(this);
        this.getDefaultPivotKeys = this.getDefaultPivotKeys.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.renderSaveButton = this.renderSaveButton.bind(this);
        this.nextClicked = this.nextClicked.bind(this);
        //this._validateClicked = this._validateClicked.bind(this);
        //this.getBool = this.getBool.bind(this);
    }

   
    buildColumnArray() {
        var arr = buildColumns(this.requiredPivotTableData);

        for (let ele of arr) {

            if (ele.fieldName == 'PivotName') {
                this.cols.push({ key: ele.fieldName ?? '', name: ele.fieldName ?? '', fieldName: ele.fieldName ?? '', minWidth: 100, maxWidth: 400, isResizable: true });
            }
            else if (ele.fieldName?.includes('Apportion')) {
                this.cols.push({ key: ele.fieldName ?? '', name: ele.fieldName ?? '', fieldName: ele.fieldName ?? '', minWidth: 50, maxWidth: 150, isResizable: true });
            }
            else if (ele.fieldName != 'PivotID' && ele.fieldName != 'PivotScopeID' && ele.fieldName != 'FilterExpressionOperator' && ele.fieldName != 'FilterExpression' && ele.fieldName != 'UIInputDataType')
                this.cols.push({ key: ele.fieldName ?? '', name: ele.fieldName ?? '', fieldName: ele.fieldName ?? '', minWidth: 50, maxWidth: 100, isResizable: true });
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

    onSelectingPivot = (event?: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {

        this.setState({ hasPivotSelectionChanged: true });

        if (item) {
            let keyUpdated = item.selected ? [...this.state.selectedPivotsOnlyKey ?? [], item.key as number] : this.state.selectedPivotsOnlyKey?.filter(val => val !== item.key);
            let updated = item.selected ? [...this.state.selectedPivots ?? [], item as Pair] : this.state.selectedPivots?.filter(val => parseInt(val.key) !== item.key);


            this.setState({
                selectedPivots: updated,
                selectedPivotsOnlyKey: keyUpdated,
            });

            this.updatePivotTableData(updated);

        }

    }

    onChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {

        //const ev = event as React.ChangeEvent<HTMLInputElement>;

        var target = ev?.target as HTMLInputElement;

        var arr = target.id.toString().split('_');

        var row = parseInt(arr[0]);
        var col = arr[1];

        //this.requiredPivotTableData[row][col as string] = checked;

        //var val = (e.target.value == "on" ? true : false);

        this.mapPivotTableColumnValue(this.requiredPivotTableData, row, col, target.checked);

        // ev?.preventDefault();
        this.forceUpdate();

    }

    handleChange = (event: {}): void => {
        const e = event as React.ChangeEvent<HTMLInputElement>;
        var target = e?.target as HTMLInputElement;
        var arr = target.id.toString().split('_');

        var row = parseInt(arr[0]);
        var col = arr[1];

        this.mapPivotTableColumnValue(this.requiredPivotTableData, row, col, e.target.value);

        this.setState({
            isFilterExpValid: false,
        });

        this.forceUpdate();
    }

    onOperatorSelected?= (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {

        if (item) {
            var target = event?.target as HTMLInputElement;
            var arr = target.id.toString().split('_');
            var row = parseInt(arr[0]);
            var col = arr[1];
            this.mapPivotTableColumnValue(this.requiredPivotTableData, row, col, item.text);
            this.forceUpdate();
        }

        //event.preventDefault();
    }

    selectedOperator() {

        let res: Pair[] = [];

        res.push({ key: "AND", text: "AND" });
        res.push({ key: "OR", text: "OR" });

        return res;
    }

    mapPivotTableColumnValue(arr: PivotTable[], row: number, colname: string, val: any) {
        switch (colname) {
            case 'IsSelectPivot': arr[row].IsSelectPivot = val; break;
            case 'IsKeyPivot': arr[row].IsKeyPivot = val; break;
            case 'IsApportionPivot': arr[row].IsApportionPivot = val; break;
            case 'IsApportionJoinPivot': arr[row].IsApportionJoinPivot = val; break;
            case 'IsScopeFilter': arr[row].IsScopeFilter = val; break;
            case 'FilterExpression': arr[row].FilterExpression = val; break;
            case 'FilterExpressionOperator': arr[row].FilterExpressionOperator = val; break;
            default: break;
        }
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

                var tobeAddedePivotDataType = '';

                for (let element of this.state.pivotsList) {
                    if (element.PivotID == parseInt(ele.key)) {
                        tobeAddedePivotDataType = element.UIInputDataType;
                        break;
                    }
                }

                var item: PivotTable = { PivotID: parseInt(ele.key), PivotName: ele.text, IsApportionJoinPivot: false, IsApportionPivot: false, IsKeyPivot: false, IsScopeFilter: false, IsSelectPivot: false, FilterExpression: '', FilterExpressionOperator: '', PivotScopeID: 0, UIInputDataType: tobeAddedePivotDataType };
                updated.push(item);
            }

        }

        this.requiredPivotTableData = updated;
    }


    render(): React.ReactElement {

        this.cols = [];
        this.buildColumnArray();

        let pivottable = (
            <TooltipHost
                content="Select/Deselect what kind of Pivot it is in the Watson call"
            >
            <DetailsList
                items={(this.requiredPivotTableData)}
                setKey="set"
                columns={this.cols}
                onRenderItemColumn={this._renderItemColumn}
                selectionMode={SelectionMode.none}
                />
            </TooltipHost>
        );

        let pivotdropdown = (

            <div>
                <TooltipHost
                    content="Select/Deselect Pivots based on if it is part of failure curve"
                >
                <Dropdown
                    placeholder="Select Pivots"
                    label="Select Pivots"
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={this.onSelectingPivot}
                    multiSelect options={this.getPivotNames(this.state.pivotsList)}
                    selectedKeys={this.state.selectedPivotsOnlyKey}
                    />
                </TooltipHost>
            </div>
        );


        let nextButton = this.nextClicked();

        return (<div>
            {pivotdropdown}
            {pivottable}
            {nextButton}
        </div>);

    }

    
    nextClicked() {

        var failureObjToBePassed: FailureConfig = {
            StudyID: this.props.studyid,
            PivotSourceSubType: this.props.selectedVerticalForStudy.key,
            Pivots: this.requiredPivotTableData
        };

        

        return (

            <div>
                <FailureCurveFilterExpression failureConfigToSave={failureObjToBePassed}/>
            </div>
        );
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
                FilterExpressionOperator: ele.smap[0].scope[0].PivotScopeOperator,
                UIInputDataType: ele.UIInputDataType
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

    


    _renderItemColumn(item: Pair, index?: number, column?: IColumn) {
        const fieldContent = (item[column?.fieldName as keyof Pair]) as string;

        var colIndex = 0;

        if (column?.key == 'PivotID')
            return <span />;
        /*
        else if (column?.key == 'FilterExpression') {
            return (
                <span>
                    <TextField value={fieldContent} id={index + '_' + column?.name} onChange={this.handleChange} />
                </span>
            );
        }
        else if (column?.key == 'FilterExpressionOperator') {
            return (
                <span>
                    <Dropdown
                        selectedKey={fieldContent}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={this.onOperatorSelected}
                        options={this.selectedOperator()}
                        id={index + '_' + column?.name}
                    />
                </span>
            );
        }
        */
        else if (column?.key != 'PivotName') {
                return (
                    <span>
                        <Checkbox checked={Boolean(fieldContent ?? false)} id={index + '_' + column?.key} onChange={this.onChange}/>
                    </span>
                );
        }
        else
            return <span>{fieldContent}</span>;
    }

}

