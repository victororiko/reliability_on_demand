import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Metric } from './model'
import { MessageBox } from '../helpers/MessageBox'

interface Props {
  userMetric: Metric | {}
  isUserMetric: boolean
}

export const AddMetricConfigButton = (props: Props) => {
  const [metricAdded, setMetricAdded] = useState(false)
  const [metricUpdated, setMetricUpdated] = useState(false)
  const handleClick = () => {
    if (props.isUserMetric) {
      axios
        .post('api/Data/UpdateMetricConfig', props.userMetric)
        .then((response) => {
          setMetricUpdated(true)
        })
        .catch((error) => {
          console.error(`failed to add metric with error = ${error}`)
        })
    } else {
      axios
        .post('api/Data/AddMetricConfig', props.userMetric)
        .then((response) => {
          setMetricAdded(true)
        })
        .catch((error) => {
          console.error(`failed to add metric with error = ${error}`)
        })
    }
  }
  return (
    <div>
      {metricAdded ? (
        <MessageBox message="User Metric Added" />
      ) : metricUpdated ? (
        <MessageBox message="User Metric Updated" />
      ) : (
        <PrimaryButton
          text={props.isUserMetric ? 'Update' : 'Add'}
          onClick={handleClick}
          allowDisabledFocus
        />
      )}
    </div>
  )
}
