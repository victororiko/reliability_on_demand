import { PrimaryButton } from '@fluentui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Metric } from './model'
import { MessageBox } from '../helpers/MessageBox'

interface Props {
  userMetric: Metric | {}
}

export const AddMetricConfigButton = (props: Props) => {
  const [metricAdded, setMetricAdded] = useState(false)
  const handleClick = () => {
    alert(`new metric to add = ${JSON.stringify(props.userMetric)}`)

    axios
      .post('api/Data/AddMetricConfig', props.userMetric)
      .then((response) => {
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
          text="Add Metric Config"
          onClick={handleClick}
          allowDisabledFocus
        />
      )}
    </div>
  )
}
