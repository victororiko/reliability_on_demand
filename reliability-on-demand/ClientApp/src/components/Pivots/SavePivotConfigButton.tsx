import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import { PopulationPivotConfig } from '../../models/filterexpression.model'

type Props = {
  StudyConfigID: number
  selectedPivots: PopulationPivotConfig[]
  callbackStatus: any
}

export const SavePivotConfigButton = (props: Props) => {
  // reset status whenever this component is mounted
  useEffect(() => {}, [props.selectedPivots])

  const handleClick = () => {
    // loop through selectedPivots generating pivot config
    const pivotsWithStudyConfigID = props.selectedPivots.map((item) => {
      return {
        ...item,
        StudyConfigID: props.StudyConfigID,
      }
    })

    // save all generated PivotConfigs - one by one
    axios
      .post('api/Data/AddOrUpdatePivotConfig/', pivotsWithStudyConfigID)
      .then((response) => {
        props.callbackStatus('Pivot Configs saved Successfully')
      })
      .catch((exception) => {
        props.callbackStatus('Error: Failed to save Pivot Configs')
        return console.error(exception)
      })

    console.debug(
      `Saved pivot config(s) with study id = ${props.StudyConfigID}`
    )
    console.debug(
      `Saved list of pivots = ${JSON.stringify(
        pivotsWithStudyConfigID,
        null,
        2
      )}`
    )
  }
  return (
    <div>
      <PrimaryButton text="Save" onClick={handleClick} />
    </div>
  )
}
