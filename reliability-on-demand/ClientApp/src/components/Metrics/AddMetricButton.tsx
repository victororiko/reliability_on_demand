import { PrimaryButton } from '@fluentui/react'
import React from 'react'
import { Metric } from './model'

type Props = {
  userMetric: Metric | {}
}

export const AddMetricButton = (props: Props) => {
  const alertClicked = () => {
    alert(`Metric to add = ${JSON.stringify(props.userMetric, null, ' ')}`)
  }
  return (
    <div>
      <PrimaryButton
        text="Add Metric"
        onClick={alertClicked}
        allowDisabledFocus
      />
    </div>
  )
}
