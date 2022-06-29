import { DefaultButton } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MessageBox } from '../helpers/MessageBox'

type Props = {
  studyid: number
  selectedPivots: any
  callbackStatus:any
}

export const ClearPivotConfigButton = (props: Props) => {
  // reset status whenever this component is mounted
  useEffect(() => {
  }, [props.selectedPivots])

  const handleClick = () => {
    // loop through selectedPivots generating pivot config
    const ans = props.selectedPivots.map((item: any) => {
      const rObj = {
        StudyID: props.studyid,
        PivotID: item.key,
        AggregateBy: true,
        PivotSourceSubType: 'AllMode',
      }
      return rObj
    })

    // Clear all generated PivotConfigs - one by one
    for (const pivotConfig of ans) {
      axios
        .post('api/Data/ClearPivotConfig/', pivotConfig)
        .then((response) => {
          props.callbackStatus('Pivot Configs Cleared Successfully')
        })
        .catch((exception) => {
          props.callbackStatus('Error: Failed to Clear Pivot Configs')
          return console.error(exception)
        })
    }
    console.debug(`Cleared pivot config(s) with study id = ${props.studyid}`)
    console.debug(`Cleared list of pivots = ${JSON.stringify(ans, null, 2)}`)
  }
  return (
    <div>
      <DefaultButton text="Remove All Pivot Configs" onClick={handleClick} />
    </div>
  )
}
