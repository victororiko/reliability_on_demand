import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Metric } from '../../models/metric.model'

type Props = {
  userMetric: Metric | {}
  isUserMetric: boolean
}

export const DeleteMetricConfigButton = (props: Props) => {
  const [metricDeleted, setMetricDeleted] = useState<boolean>(false)

  const handleClick = () => {
    console.log('Metric to be deleted', JSON.stringify(props.userMetric))
    if (props.isUserMetric) {
      axios
        .post('api/Data/DeleteMetricConfig', props.userMetric)
        .then((response) => {
          setMetricDeleted(true)
        })
        .catch((error) => {
          console.error(`failed to add metric with error = ${error}`)
        })
    }
  }

  return (
    <div>
      {metricDeleted ? (
        'Deleted Metric'
      ) : (
        <PrimaryButton
          text="Delete"
          onClick={handleClick}
          disabled={!props.isUserMetric}
        />
      )}
    </div>
  )
}
