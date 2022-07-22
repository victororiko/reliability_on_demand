import React from 'react'
import { DefaultButton, TooltipHost, Label } from '@fluentui/react'
import {
  FilterExpTable,
  FailureConfig,
  Pivot,
} from '../../models/failurecurve.model'

import { getFailureCurvePivotsToSave } from './service'

type Props = {
  ButtonName: string
  callBack: any
  dataSaved: boolean
  filterExpTable: FilterExpTable[]
  pivots: Pivot[]
  StudyConfigID: number
  verticals: string[]
  pivotSourceSubType: string
}

export const AddOrUpdateButton = (props: Props) => {
  const handleClick = () => {
    const failureConfig: FailureConfig = {
      StudyConfigID: props.StudyConfigID,
      PivotSourceSubType: props.pivotSourceSubType,
      Verticals: props.verticals,
      Pivots: getFailureCurvePivotsToSave(props.filterExpTable, props.pivots),
    }

    props.callBack(failureConfig)
  }

  const saveLabel = !props.dataSaved ? (
    ''
  ) : (
    <div>
      <Label>Data has been saved successfully</Label>
    </div>
  )

  return (
    <div>
      <TooltipHost content="Click to save all the selected configuration">
        <div>
          <DefaultButton
            text={props.ButtonName}
            onClick={handleClick}
            allowDisabledFocus
            disabled={false}
            checked={false}
          />
        </div>
      </TooltipHost>
      {saveLabel}
    </div>
  )
}
