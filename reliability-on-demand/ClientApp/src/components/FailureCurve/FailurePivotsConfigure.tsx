import * as React from 'react';
import { Pair, Pivot, FailureConfig, PivotTable, PivotSQLResult, SmapSQL} from '../../models/FailureConfig.model';
import { initializeIcons } from '@uifabric/icons';
import { largeTitle } from '../helpers/Styles';
import { buildColumns, Separator, IColumn, Toggle, TooltipHost, Icon, DetailsList, Checkbox, IDictionary, SelectionMode } from "@fluentui/react";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
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
        })

        this.onSelectingPivot = this.onSelectingPivot.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this._renderItemColumn = this._renderItemColumn.bind(this);
    }

    /**
     * Prior to rendering the component, load up study configs from backend
     */
    componentDidMount() {
        this.populateData();
    }

    buildColumnArray() {
        var arr = buildColumns(this.requiredPivotTableData);

        for (let ele of arr) {
            if (ele.fieldName != 'PivotID')
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
        this.onPivotDropdownLoad();
    }

    getDefaultPivotKeys() {
        this.setState({
            selectedPivots: this.resultantPivotSQL.map(this.extractPivotPair),
            selectedPivotsOnlyKey: this.extractPivotIDs(this.resultantPivotSQL),
        });
        this.buildColumnArray();
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
            let updated = item.selected ? [...this.state.selectedPivots ?? [], item as Pair] : this.state.selectedPivots?.filter(val => val.key !== item.key);

            this.setState({
                selectedPivots: updated,
                selectedPivotsOnlyKey: keyUpdated,
            });

            this.updatePivotTableData(updated);
           
        }

    }

    checkboxChange = (ev?: React.FormEvent<HTMLDivElement>, checked?: boolean): void => {

        this.setState({ hasPivotSelectionChanged: true });

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
                var item: PivotTable = { PivotID: parseInt(ele.key), PivotName: ele.text, IsApportionJoinPivot: false, IsApportionPivot: false, IsKeyPivot: false, IsScopeFilter: false, IsSelectPivot: false };
                updated.push(item);
            }

        }

        this.requiredPivotTableData = updated;


    }


    render(): React.ReactElement {

         let pivotdropdown = (

            <div>

                <Dropdown
                    placeholder="Select Pivots"
                    label="Select Pivots"
                    // eslint-disable-next-line react/jsx-no-bind
                     onChange={this.onSelectingPivot}
                     multiSelect options={this.getPivotNames(this.state.pivotsList)}
                     selectedKeys={this.state.selectedPivotsOnlyKey}
                   // isOptionDisabled={false}
                />
            </div>
        );

        let pivottable = this.renderPivotTable();

        return (<div>
            {pivotdropdown}
            {pivottable}
        </div>);

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


    renderPivotTable() {

        return (
            <DetailsList
                items={this.requiredPivotTableData}
                setKey="set"
                columns={this.cols}
                onRenderItemColumn={this._renderItemColumn}
                onItemInvoked={this._onItemInvoked}
                selectionMode={SelectionMode.none}
            />
        );
    }


    private _onItemInvoked(item: any, index: number | undefined): void {
        alert(`Item ${item.name} at index ${index} has been invoked.`);
    }


    _renderItemColumn(item: Pair, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName as keyof Pair] as string;

        if (column.key == 'PivotID')
            return null;
        else if (column.key != 'PivotName') {

            return (
                <span>
                    <Checkbox checked={Boolean(fieldContent)} onChange={this.checkboxChange.bind(this)} />
                </span>
            );
        }
        else
            return <span>{fieldContent}</span>;
    }


    getRequiredSchemaForPivotTable() {

        for (let ele of this.resultantPivotSQL) {
            var item: PivotTable = {
                PivotID: ele.PivotID,
                PivotName: ele.PivotSourceColumnName,
                IsApportionJoinPivot: ele.smap[0].IsApportionJoinColumn,
                IsApportionPivot: ele.smap[0].IsApportionColumn,
                IsKeyPivot: ele.smap[0].IsKeyColumn,
                IsSelectPivot: ele.smap[0].IsSelectColumn,
                IsScopeFilter: (ele.smap[0].PivotScopeID != null ? true : false),
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
    






}
