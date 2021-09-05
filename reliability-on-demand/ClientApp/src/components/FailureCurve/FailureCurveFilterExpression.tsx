import { buildColumns, DefaultButton, DetailsList, Dropdown, IColumn, SelectionMode, TextField } from '@fluentui/react';
import * as React from 'react';
import { FailureConfig, Pair, Pivot, FilterExpTable, PivotTable } from '../../models/FailureConfig.model';
import axios from 'axios';
// Our components that make up the page


export interface IFailureCurveFilterExpressionProps {
    failureConfigToSave: FailureConfig;
}

export interface IFailureCurveFilterExpressionState {

    PivotsToFilter: Pair[],
    RelationalOperators: Pair[],
    Operators: Pair[],
}

export class FailureCurveFilterExpression extends React.Component<IFailureCurveFilterExpressionProps, IFailureCurveFilterExpressionState> {

    DefaultPivot: FilterExpTable[] = [];
    cols: IColumn[] = [];
    HasNextClicked: boolean = false;

    constructor(props: any) {
        super(props);

        this.setState({
            PivotsToFilter: [],
            RelationalOperators: [],
            Operators: []
        });

        

    }

    componentDidMount() {
        this.nextClicked = this.nextClicked.bind(this);
        this.loadPivots = this.loadPivots.bind(this);
        this.loadRelationalOperators = this.loadRelationalOperators.bind(this);
        this.loadOperators = this.loadOperators.bind(this);
        this.buildColumnArray = this.buildColumnArray.bind(this);
        this.renderDetailedList = this.renderDetailedList.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.onPivotSelected = this.onPivotSelected.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
        this.onTextBoxChange = this.onTextBoxChange.bind(this);
        this._renderItemColumn = this._renderItemColumn.bind(this);
        this.getPivotID = this.getPivotID.bind(this);
        this.loadRelationalOperators();
        this.loadOperators();
    }

    loadRelationalOperators() {
        var arr: Pair[] = [];
        arr.push({ key: '', text:'' });
        arr.push({ key: 'AND', text: 'AND' });
        arr.push({ key: 'OR', text: 'OR' });
        
        this.setState({
            RelationalOperators: arr,
        })
    }

    loadOperators() {
        var arr: Pair[] = [];
        arr.push({ key: '', text: '' });
        arr.push({ key: '>', text: '>' });
        arr.push({ key: '<', text: '<' });
        arr.push({ key: '>=', text: '>=' });
        arr.push({ key: '<=', text: '<=' });
        arr.push({ key: '==', text: '==' });
        arr.push({ key: '!=', text: '!=' });

        this.setState({
            Operators: arr,
        })
    }

    loadPivots() {

        var arr: Pair[] = [];

        for (let ele of this.props.failureConfigToSave.Pivots) {
            if (ele.IsScopeFilter = true) {
                arr.push({ key: ele.PivotID.toString(), text: ele.PivotName });

                var exp = ele.FilterExpression;

                for (let eleExp of exp.split(ele.PivotName)) {
                    if (eleExp != null && eleExp != '') {
                        var rop = this.getContainingElementFromArr(eleExp, this.state.RelationalOperators);

                        var ropArr;

                        if (rop != '' || rop != undefined)
                            ropArr = eleExp.split(rop);
                        else
                            ropArr = eleExp;

                        var ctr = 0;

                        for (let eleRop of ropArr) {

                            var trimele = eleRop.trim();
                            if (trimele != null && trimele != '') {
                                var op = this.getContainingElementFromArr(trimele, this.state.Operators);
                                var val = trimele.split(op ?? '')[1];

                                if (ctr == (ropArr.length - 1))
                                    this.DefaultPivot.push({ PivotID: ele.PivotID, PivotName: ele.PivotName, PivotValue: val, PivotScopeID: ele.PivotScopeID, Operator: op ?? '', RelationalOperator: ele.FilterExpressionOperator });
                                else
                                    this.DefaultPivot.push({ PivotID: ele.PivotID, PivotName: ele.PivotName, PivotValue: val, PivotScopeID: ele.PivotScopeID, Operator: op ?? '', RelationalOperator: rop ?? '' });
                            }

                            ctr = ctr + 1;
                        }

                    }
                }
                
            }
        }

        this.setState({ PivotsToFilter: arr });
    }


    getContainingElementFromArr(input: string, arr: Pair[]) {
        var res;
        for (let op of arr) {
            if (input?.indexOf(op.key) !== -1 && op.key != '') {
                res = op.key;
                break;
            }
        }

        return res;
    }

    buildColumnArray() {
        var arr = buildColumns(this.DefaultPivot);

        this.cols.push({ key: 'Add/Delete', name: 'Add/Delete', fieldName: 'Add/Delete', minWidth: 100, maxWidth: 200, isResizable: true });

        for (let ele of arr) {
            if (ele.fieldName != 'PivotID' && ele.fieldName != 'PivotScopeID')
                this.cols.push(ele);
        }
    }


    render(): React.ReactElement {


        let nextButton = (<div>
            <DefaultButton text="Next" onClick={this.nextClicked} allowDisabledFocus disabled={false} checked={false} />
        </div>);

        let detailedList = this.HasNextClicked == true ? this.renderDetailedList() : '';

        return (<div>
            { nextButton }
            {detailedList}
            </div>
            );
        
    }


    nextClicked() {

        this.loadPivots();
        this.buildColumnArray();
        this.HasNextClicked = true;
        
    }


    renderDetailedList() {
        return (
            <div>
                <DetailsList
                    items={(this.DefaultPivot)}
                    setKey="set"
                    columns={this.cols}
                    onRenderItemColumn={this._renderItemColumn}
                    selectionMode={SelectionMode.none}
                />
            </div>
        );
    }


    addClicked() {

        this.DefaultPivot.push({ PivotID: 0, PivotName: '', PivotValue: '', PivotScopeID: 0, Operator:'', RelationalOperator: '' });
    }

    deleteClicked() {

    }

    onPivotSelected() {

    }

    onTextBoxChange() {

    }

    getPivotID(input: any) {

        for (let d of this.props.failureConfigToSave.Pivots) {
            if (d.PivotName == input["fieldContent"]) {
                return d.PivotID.toString();
            }
        }

        return '';

    }


    _renderItemColumn(item: Pair, index?: number, column?: IColumn) {
        const fieldContent = (item[column?.fieldName as keyof Pair]) as string;

        var colIndex = 0;

        if (column?.key == 'Add/Delete')
            return (
                <span>
                    <DefaultButton text="+" onClick={this.addClicked} allowDisabledFocus disabled={false} checked={false} />
                    <DefaultButton text="X" onClick={this.deleteClicked} allowDisabledFocus disabled={false} checked={false} />
                </span>
            );
        else if (column?.key == 'PivotName') {
            var val = { fieldContent };
            var key = this.getPivotID(val);
            this.forceUpdate();

            return (
                <span>
                    <Dropdown
                        selectedKey={key}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={this.onPivotSelected}
                        options={this.state.PivotsToFilter}
                        id={index + '_' + column?.name}
                    />
                </span>
            );
        }
        else if (column?.key == 'Operator') {
            return (
                <span>
                    <Dropdown
                        selectedKey={fieldContent}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={this.onPivotSelected}
                        options={this.state.Operators}
                        id={index + '_' + column?.name}
                    />
                </span>
            );
        }
        else if (column?.key == 'RelationalOperator') {
            return (
                <span>
                    <Dropdown
                        selectedKey={fieldContent}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={this.onPivotSelected}
                        options={this.state.RelationalOperators}
                        id={index + '_' + column?.name}
                    />
                </span>
            );
        }
        else
            return (<span>
                <TextField value={fieldContent} id={index + '_' + column?.name} onChange={this.onTextBoxChange} />
            </span>);
    }



    
}

