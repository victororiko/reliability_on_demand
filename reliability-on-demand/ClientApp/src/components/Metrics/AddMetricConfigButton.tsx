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
  const handleClick = () => {
    if (props.isUserMetric) {
      console.debug('Update user metric')
    } else {
      console.debug(
        `new metric to add = ${JSON.stringify(props.userMetric, null, '  ')}`
      )
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
