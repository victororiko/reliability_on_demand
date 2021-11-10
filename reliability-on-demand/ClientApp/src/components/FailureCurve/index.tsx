import React from 'react'
import { WikiLink } from '../helpers/WikiLink';
import { VerticalsListComboBox } from './VerticalsListComboBox';
import { FailureCurveButton } from './FailureCurveButton';
import { SelectVerticalDropdown } from './SelectVerticalDropdown';
import { SelectPivotsComboBox } from './SelectPivotsComboBox';
import { PivotsDetailsList } from './PivotsDetailsList';
import { FilterExpressionButton } from './FilterExpressionButton';
import { FilterExpressionDetailsList } from './FilterExpressionDetailsList';
import { SaveConfigButton } from './SaveConfigButton';
import { ValidateFilterExpression } from './ValidateFilterExpression';

interface Props {
    study_id: number
}

export const FailureCurve = (props: Props) => (
        <div>
            <h1>Failure Curve Section</h1>
            <p>Study id = {props.study_id}</p>
            <WikiLink
                title="Wiki for this page"
                url="https://www.osgwiki.com/wiki/RIOD_-_Failure_Curve_Section" />
            <VerticalsListComboBox />
            <FailureCurveButton />
            <SelectVerticalDropdown />
            <SelectPivotsComboBox />
            <WikiLink 
                title="Watson Wiki" 
                url="https://www.osgwiki.com/wiki/Watson_1508_SnapShot_API#WatsonSnapshotAggView_1508_parameters" />
            <PivotsDetailsList />
            <FilterExpressionButton />
            <FilterExpressionDetailsList />
            <ValidateFilterExpression />
            <SaveConfigButton />
        </div>
    )
