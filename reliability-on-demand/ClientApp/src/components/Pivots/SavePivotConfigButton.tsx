import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MessageBox } from '../helpers/MessageBox'

type Props = {
  studyid: number
  selectedPivots: any
  callbackStatus:any
}

export const SavePivotConfigButton = (props: Props) => {
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

    // save all generated PivotConfigs - one by one
    for (const pivotConfig of ans) {
      axios
        .post('api/Data/AddOrUpdatePivotConfig/', pivotConfig)
        .then((response) => {
          props.callbackStatus('Pivot Configs saved Successfully')
        })
        .catch((exception) => {
          props.callbackStatus('Error: Failed to save Pivot Configs')
          return console.error(exception)
        })
    }
    console.debug(`Saved pivot config(s) with study id = ${props.studyid}`)
    console.debug(`Saved list of pivots = ${JSON.stringify(ans, null, 2)}`)
  }
  return (
    <div>
      <PrimaryButton text="Add Pivot Configs" onClick={handleClick} />
    </div>
  )
}
