import { DefaultButton, Label, TooltipHost } from '@fluentui/react';
import * as React from 'react';
import { FilterExpTable } from '../../models/FailureConfig.model';
import axios from 'axios';
// Our components that make up the page


export interface IFailureCurveValidateProps {
    FilterExpArr: FilterExpTable[];
}

export interface IFailureCurveValidateState {
    hasValidatedData: boolean,
}

export class FailureCurveValidate extends React.Component<IFailureCurveValidateProps, IFailureCurveValidateState> {

    validateStatement: string = '';

    constructor(props: IFailureCurveValidateProps) {
        super(props);

        this.state = ({
            hasValidatedData: true,
        });
        this._validateClicked = this._validateClicked.bind(this);
    }

    componentDidMount() {
        this._validateClicked = this._validateClicked.bind(this);
        this.state = ({
            hasValidatedData: true,
        });
    }

    render() {

        let validateButton = (
            <TooltipHost
                content="Click to validate your filter expression"
            >
            <div>
                <DefaultButton text="Validate Filter Expression" onClick={this._validateClicked} allowDisabledFocus disabled={false} checked={false} />
                </div>
            </TooltipHost>
        );

        let validateStatement =  (<div><Label>{this.validateStatement}</Label></div>);
        return (<div>
            {validateButton}
            {validateStatement}
        </div>);
    }


    async _validateClicked() {

        var flag = false;
        var relationalOpCount = this.getRelationalOperatorCount();

        if (relationalOpCount != (this.props.FilterExpArr.length - 1)) {
            this.setState({ hasValidatedData: false });
            this.validateStatement = "Relational operator not set properly";
            return;
        }


        for (let ele of this.props.FilterExpArr) {
            if (((ele.UIInputDataType == "number") && (isNaN(parseInt(ele.PivotValue))))) {
                    this.setState({ hasValidatedData: false });
                    flag = true;
                    this.validateStatement = "Number expected in " + ele.PivotName;
                    break;
            }
            else if (ele.Operator == null || ele.Operator == '') {
                this.setState({ hasValidatedData: false });
                this.validateStatement = "Operator null issue in " + ele.Operator;
                flag = true;
                break;
            }
            else if (ele.PivotValue == null || ele.PivotValue == '') {
                this.setState({ hasValidatedData: false });
                this.validateStatement = "Pivot Value null issue in " + ele.PivotValue;
                flag = true;
                break;
            }
        }

        if (flag == false) {
            this.validateStatement = "Filter expression has been validated successfully" + "<br/>" + this.showFilterExpression();
            this.setState({ hasValidatedData: true });
        }

              
    }

    getRelationalOperatorCount() {

        var ropCount = 0;
        for (let ele of this.props.FilterExpArr) {
            if (ele.RelationalOperator != null && ele.RelationalOperator != '') {
                ropCount++;
            }
        }

        return ropCount;
    }

    showFilterExpression() {

        var filterexp = '';
        var lastPieceInExp = '';

        for (let ele of this.props.FilterExpArr) {

            if (ele.RelationalOperator != null && ele.RelationalOperator != '') {
                filterexp = filterexp + " " + ele.PivotName + " " + ele.Operator + " " + ele.PivotValue + " " + ele.RelationalOperator;
            }
            else {
                lastPieceInExp = ele.PivotName + " " + ele.Operator + " " + ele.PivotValue;
            }
        }

        filterexp = filterexp + " " + lastPieceInExp;

        filterexp = filterexp.trim();

        return filterexp;
    }



    
}

