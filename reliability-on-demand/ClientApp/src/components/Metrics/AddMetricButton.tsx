import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Metric } from './model'
import { MessageBox } from '../helpers/MessageBox'

interface Props {
  userMetric: Metric | {}
}

export const AddMetricButton = (props: Props) => {
  const [metricAdded, setMetricAdded] = useState(false)
  const alertClicked = () => {
    alert(`new metric to add = ${JSON.stringify(props.userMetric)}`)

    axios
      .post('api/Data/AddMetric', props.userMetric)
      .then((response) => {
        // TODO show an indication that new metric has been added - maybe refresh list of metrics
        setMetricAdded(true)
      })
      .catch((error) => {
        console.error(`failed to add metric with error = ${error}`)
      })
  }
  return (
    <div>
      {metricAdded ? (
        <MessageBox message="User Metric Added" />
      ) : (
        <PrimaryButton
          text="Add Metric"
          onClick={alertClicked}
          allowDisabledFocus
        />
      )}
    </div>
  )
}
