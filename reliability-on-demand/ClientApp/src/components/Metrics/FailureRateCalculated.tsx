import { Position, SpinButton } from '@fluentui/react'
import React from 'react'

interface Props {
  failureRateStr: string
  callback: any
}

// By default the field grows to fit available width. Constrain the width instead.
export const FailureRateCalculated = (props: Props) => {
  const onChange = (
    event: React.SyntheticEvent<HTMLElement>,
    newValue?: string
  ) => {
    if (newValue !== undefined) {
      props.callback(newValue)
    }
  }

  return (
    <div>
      <SpinButton
        label="Failure Rate"
        labelPosition={Position.top}
        value={props.failureRateStr}
        min={0}
        max={1}
        step={0.001}
        onChange={onChange}
      />
    </div>
  )
}
