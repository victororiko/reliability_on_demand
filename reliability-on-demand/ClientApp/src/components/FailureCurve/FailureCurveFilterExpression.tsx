import { buildColumns, DefaultButton, DetailsList, Dropdown, IColumn, IDictionary, IDropdownOption, SelectionMode, Spinner, SpinnerSize, TextField, TooltipHost } from '@fluentui/react';
import * as React from 'react';
import { FailureConfig, Pair, FilterExpTable, PivotScopeFilter } from '../../models/FailureConfig.model';
import { FailureCurveSave } from '../FailureCurve/FailureCurveSave';
import '../FailureCurve/FailureCurveSection.css';
// Our components that make up the page


export interface IFailureCurveFilterExpressionProps {
    failureConfigToSave: FailureConfig;
}

export interface IFailureCurveFilterExpressionState {

    PivotsToFilter: Pair[],
    RelationalOperators: Pair[],
    Operators: Pair[],
    hasRowDeleted: boolean,
    hasRowAdded: boolean,
}

export class FailureCurveFilterExpression extends React.Component<IFailureCurveFilterExpressionProps, IFailureCurveFilterExpressionState> {

    DefaultPivot: FilterExpTable[] = [];
    cols: IColumn[] = [];
    HasNextClicked: boolean = false;
    pivotValuePlaceholder: string = '';

    constructor(props: any) {
        super(props);

        this.state = ({
            PivotsToFilter: [],
            RelationalOperators: [],
            Operators: [],
            hasRowDeleted: false,
            hasRowAdded: false,
        });



    }

    componentDidMount() {

        this.state = ({
            PivotsToFilter: [],
            RelationalOperators: [],
            Operators: [],
            hasRowDeleted: false,
            hasRowAdded: false,
        });
        this.nextClicked = this.nextClicked.bind(this);
        this.loadPivots = this.loadPivots.bind(this);
        this.loadRelationalOperators = this.loadRelationalOperators.bind(this);
        this.loadOperators = this.loadOperators.bind(this);
        this.buildColumnArray = this.buildColumnArray.bind(this);
        this.renderDetailedList = this.renderDetailedList.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
        this.onTextBoxChange = this.onTextBoxChange.bind(this);
        this._renderItemColumn = this._renderItemColumn.bind(this);
        this.getPivotID = this.getPivotID.bind(this);
        this.renderSaveButton = this.renderSaveButton.bind(this);
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
        // Order is important as '>=' should be detected and not be confused with '>' 
        arr.push({ key: '', text: '' });
        arr.push({ key: '>=', text: '>=' });
        arr.push({ key: '<=', text: '<=' });
        arr.push({ key: '==', text: '==' });
        arr.push({ key: '!=', text: '!=' });
        arr.push({ key: '<', text: '<' });
        arr.push({ key: '>', text: '>' });

        this.setState({
            Operators: arr,
        })
    }

    // It loads the splits the filter expression in the SQL table and break it into pieces desired by UI to represent
    // Like SQL data has "Build >= 21000" => this function will add a row in "DefaultPivot" array with (PivotID,Build,21000,PivotScopeID,>=, RelationalOperator)
    // This help in populating the detailedlist controls with the required information.
    loadPivots() {

        var PivotsToFilterTemp: Pair[] = [];

        for (let ele of this.props.failureConfigToSave.Pivots) {
            if (ele.IsScopeFilter == true) {
                PivotsToFilterTemp.push({ key: ele.PivotID.toString(), text: ele.PivotName });

                var exp = ele.FilterExpression;

                if (exp != null && exp != '') {
                    for (let eleExp of exp.split(ele.PivotName)) {
                        if (eleExp != null && eleExp != '') {

                            // First find which relational operator is contained in the filter expression
                            var rop = this.getContainingElementFromArr(eleExp, this.state.RelationalOperators);

                            var ropArr: string[] = [];

                            // Split the array based on the relational operator it contains
                            if ((typeof rop != 'undefined') && (rop != ''))
                                ropArr = eleExp.split(rop ?? '');
                            else
                                ropArr[0] = eleExp;

                            var ropArrPtr = 0;

                            for (let eleRop of ropArr) {

                                var trimele = eleRop.trim();
                                if (trimele != null && trimele != '') {

                                    //Check which logical operator does the filter expression contains
                                    var op = this.getContainingElementFromArr(trimele, this.state.Operators);
                                    var val = (trimele.split(op ?? '')[1]).trim();

                                    if (ropArrPtr == (ropArr.length - 1))
                                        this.DefaultPivot.push({ PivotID: ele.PivotID, PivotName: ele.PivotName, PivotValue: val, PivotScopeID: ele.PivotScopeID, Operator: op ?? '', RelationalOperator: ele.FilterExpressionOperator, UIInputDataType: ele.UIInputDataType });
                                    else
                                        this.DefaultPivot.push({ PivotID: ele.PivotID, PivotName: ele.PivotName, PivotValue: val, PivotScopeID: ele.PivotScopeID, Operator: op ?? '', RelationalOperator: rop ?? '', UIInputDataType: ele.UIInputDataType });
                                }

                                ropArrPtr = ropArrPtr + 1;
                            }

                        }
                    }
                }
                
            }
        }

        if (this.DefaultPivot == null || this.DefaultPivot.length == 0)
            this.DefaultPivot.push({ PivotID: 0, PivotName: '', PivotValue: '', PivotScopeID: 0, Operator: '', RelationalOperator: '', UIInputDataType: '' });

        this.setState({ PivotsToFilter: PivotsToFilterTemp });
    }

    // It checks which element from the array does the input contains
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

        this.cols.push({ key: 'Add/Delete', name: 'Add/Delete', fieldName: 'Add/Delete', minWidth: 50, maxWidth: 100, isResizable: true });
        this.cols.push({ key: 'PivotName', name: 'PivotName', fieldName: 'PivotName', minWidth: 100, maxWidth: 350, isResizable: true });
        this.cols.push({ key: 'Operator', name: 'Operator', fieldName: 'Operator', minWidth: 100, maxWidth: 100, isResizable: true });
        this.cols.push({ key: 'PivotValue', name: 'PivotValue', fieldName:  'PivotValue', minWidth: 100, maxWidth: 300, isResizable: true });
       
        for (let ele of arr) {
            if (ele.fieldName != 'PivotID' && ele.fieldName != 'PivotScopeID' && ele.fieldName != 'PivotName' && ele.fieldName != 'Operator' && ele.fieldName != 'PivotValue' && ele.fieldName != 'UIInputDataType')
                this.cols.push({ key: ele.fieldName ?? '', name: ele.fieldName ?? '', fieldName: ele.fieldName ?? '', minWidth: 100, maxWidth: 300, isResizable: true });
        }
    }


    render(): React.ReactElement {
        let nextButton = (<div>
            <TooltipHost
                content="Click Next to configure the filter expression"
            >
                <DefaultButton text="Next" onClick={this.nextClicked} allowDisabledFocus disabled={false} checked={false} />
            </TooltipHost>
        </div>);

        let detailedList = this.HasNextClicked == true ? this.renderDetailedList() : '';

        //let spinner = (this.state.hasRowDeleted == true || this.state.hasRowAdded == true) ? this.displaySpinner() : '';

        let saveButton = (this.HasNextClicked == true ? this.renderSaveButton(): '');

        return (<div>
            { nextButton }
            {detailedList}
            {saveButton}
            </div>
            );
        
    }

    displaySpinner() {
        return (<div><Spinner size={SpinnerSize.medium} /></div>);
    }


    /* This function reduces the inputs provided using filter expression UI by the user into one filter expression per pivot
     * followed by updating the filter expression and the relational operator for each pivot in the failureconfig variable.
     * Finally passes the object to the save component for saving the data.
     */
    renderSaveButton() {

        var pivotexpMap: PivotScopeFilter[] = [];

        var DefaultPivotPtr = 0;

        // Iterating over all the rows provided by the filter expression UI and reducing them to one for each pivot
        for (let d of this.DefaultPivot) {
            var pid = d.PivotID;
            var flag = false;

            for (var i = 0; i < pivotexpMap.length; i++) {
                var id = pivotexpMap[i].PivotID;

                if (pid == id) {
                    var filterexp = pivotexpMap[i].FilterExpression;
                    var exp = filterexp + " " + pivotexpMap[i].RelationalOperator + " " + d.PivotName + " " + d.Operator + " " + d.PivotValue;
                    var rop = d.RelationalOperator;
                    pivotexpMap[i].FilterExpression = exp;
                    pivotexpMap[i].RelationalOperator = rop;
                    flag = true;
                    break;
                }

            }

            if (flag == false) {
                var filterexp = d.PivotName + " " + d.Operator + " " + d.PivotValue;
                pivotexpMap.push({ PivotID: d.PivotID, FilterExpression: filterexp, RelationalOperator: d.RelationalOperator });
            }

            if (DefaultPivotPtr == (this.DefaultPivot.length - 1)) {
                pivotexpMap[pivotexpMap.length - 1].RelationalOperator = '';
            }

            DefaultPivotPtr++;

        }

        // Updating the obj with the new filter expression and operator provided by the end user using UI
        for (let ele of pivotexpMap) {
            var pid = ele.PivotID;

            for (var i = 0; i < this.props.failureConfigToSave.Pivots.length; i++) {
                var id = this.props.failureConfigToSave.Pivots[i].PivotID;
                if (pid == id) {
                    this.props.failureConfigToSave.Pivots[i].FilterExpression = ele.FilterExpression;
                    this.props.failureConfigToSave.Pivots[i].FilterExpressionOperator = ele.RelationalOperator;
                    break;
                }
            }
        }


        //setting the filterexpression to '' in case of delete and pivotscopeid to null
        for (var i = 0; i < this.props.failureConfigToSave.Pivots.length; i++) {
            var pivotscopeid = this.props.failureConfigToSave.Pivots[i].PivotScopeID;
            var pid = this.props.failureConfigToSave.Pivots[i].PivotID;

            if (pivotscopeid != null && pivotscopeid != 0) {
                var flag = false;
                for (let ele of pivotexpMap) {
                    if (pid == ele.PivotID) {
                        flag = true;
                        break;
                    }
                }


                if (flag == false) {
                    this.props.failureConfigToSave.Pivots[i].FilterExpression = '';
                    this.props.failureConfigToSave.Pivots[i].FilterExpressionOperator = '';
                    this.props.failureConfigToSave.Pivots[i].PivotScopeID = 0;
                }
            }
        }



        // Setting pivotscopeid to 0 instead of null so that it doesn't cause any error while passing to data controller
        for (var i = 0; i < this.props.failureConfigToSave.Pivots.length; i++) {
            if (this.props.failureConfigToSave.Pivots[i].PivotScopeID == null)
                this.props.failureConfigToSave.Pivots[i].PivotScopeID = 0;
        }


        return (

            <div>
                <FailureCurveSave failureConfigToSave={this.props.failureConfigToSave} />
            </div>
        );

    }


    nextClicked() {

        this.DefaultPivot = [];
        this.cols = [];
        this.loadPivots();
        this.buildColumnArray();
        this.HasNextClicked = true;
        this.setState({ hasRowDeleted: false });
        
    }


    renderDetailedList() {
        return (
            <div>
                <TooltipHost
                    content="Configure the filter expression"
                >
                <DetailsList
                    items={(this.DefaultPivot)}
                    setKey="set"
                    columns={this.cols}
                    onRenderItemColumn={this._renderItemColumn}
                    selectionMode={SelectionMode.none}
                    />
                </TooltipHost>
            </div>
        );
    }


    addClicked(id: any) {

        this.setState({ hasRowAdded: true });

        var item: FilterExpTable = ({ PivotID: 0, PivotName: '', PivotValue: '', PivotScopeID: 0, Operator: '', RelationalOperator: '', UIInputDataType:'' });

        this.DefaultPivot = [...this.DefaultPivot.slice(0, id), item, ...this.DefaultPivot.slice(id)];

        this.setState({ hasRowAdded: false });
    }

    deleteClicked(id: any) {

        this.setState({ hasRowDeleted: true });
        var res = this.DefaultPivot;
        this.DefaultPivot = [];

        for (var i = 0; i < res.length; i++) {

            if (i !== id) {
                this.DefaultPivot.push(res[i]);
            }
        }

        this.setState({ hasRowDeleted: false });
    }

    onPivotSelected?= (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {

        if (item) {
            var target = event?.target as HTMLInputElement;
            var arr = target.id.toString().split('_');
            var row = parseInt(arr[0]);
            var col = arr[1];
            this.mapPivotTableColumnValue(this.DefaultPivot, row, col, item.text);
            this.mapPivotTableColumnValue(this.DefaultPivot, row, 'PivotID', item.key);

            for (let ele of this.DefaultPivot) {
                if (ele.PivotID == item.key && ele.UIInputDataType!='') {
                    this.pivotValuePlaceholder = ele.UIInputDataType;
                    break;
                }
            }

            this.forceUpdate();
            this.cols = [];
            this.buildColumnArray();
        }

    }

    onOperatorSelected?= (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {

        if (item) {
            var target = event?.target as HTMLInputElement;
            var arr = target.id.toString().split('_');
            var row = parseInt(arr[0]);
            var col = arr[1];
            this.mapPivotTableColumnValue(this.DefaultPivot, row, col, item.text);
            this.forceUpdate();
            this.cols = [];
            this.buildColumnArray();
        }

    }

    onRelationalOperatorSelected?= (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {

        if (item) {
            var target = event?.target as HTMLInputElement;
            var arr = target.id.toString().split('_');
            var row = parseInt(arr[0]);
            var col = arr[1];
            this.mapPivotTableColumnValue(this.DefaultPivot, row, col, item.text);
            this.forceUpdate();
            this.cols = [];
            this.buildColumnArray();
        }

    }

    onTextBoxChange = (event: {}): void => {
        const e = event as React.ChangeEvent<HTMLInputElement>;
        var target = e?.target as HTMLInputElement;
        var arr = target.id.toString().split('_');

        var row = parseInt(arr[0]);
        var col = arr[1];

        this.mapPivotTableColumnValue(this.DefaultPivot, row, col, e.target.value);
        this.forceUpdate();
        e.preventDefault();
        this.cols = [];
        this.buildColumnArray();
    }


    mapPivotTableColumnValue(arr: FilterExpTable[], row: number, colname: string, val: any) {
        switch (colname) {
            case 'Operator': arr[row].Operator = val; break;
            case 'PivotID': arr[row].PivotID = val; break;
            case 'PivotName': arr[row].PivotName = val; break;
            case 'PivotScopeID': arr[row].PivotScopeID = val; break;
            case 'PivotValue': arr[row].PivotValue = val; break;
            case 'RelationalOperator': arr[row].RelationalOperator = val; break;
            default: break;
        }
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

        if (column?.key == 'Add/Delete') {

            return (
                <span>
                    <DefaultButton text="+" onClick={() => this.addClicked(index)} id={index?.toString()} allowDisabledFocus disabled={false} checked={false} className="Button" />
                    <DefaultButton text="X" onClick={() => this.deleteClicked(index)} id={index?.toString()} allowDisabledFocus disabled={false} checked={false} className="Button" />
                </span>
            );
        }
        else if (column?.key == 'PivotName') {
            var val = { fieldContent };
            var key = this.getPivotID(val);

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
                        onChange={this.onOperatorSelected}
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
                        onChange={this.onRelationalOperatorSelected}
                        options={this.state.RelationalOperators}
                        id={index + '_' + column?.name}
                    />
                </span>
            );
        }
        else
            return (<span>
                <TextField value={fieldContent} id={index + '_' + column?.name} onChange={this.onTextBoxChange} placeholder={this.pivotValuePlaceholder} />
            </span>);
    }



    
}

