import React from 'react'
import { ISpinButtonStyles, SpinButton, Position } from '@fluentui/react'

interface Props {
  callback: any
  mttfHoursStr: string
}

// By default the field grows to fit available width. Constrain the width instead.
const styles: Partial<ISpinButtonStyles> = { spinButtonWrapper: { width: 75 } }

export const SpinButtonHour = (props: Props) => {
  const onChange = React.useCallback(
    (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
      if (newValue !== undefined) {
        // In reality this might have some additional validation or other special handling
        props.callback(newValue)
      }
    },
    []
  )

  return (
    <div>
      <SpinButton
        label="Hours"
        labelPosition={Position.top}
        value={props.mttfHoursStr}
        step={1}
        incrementButtonAriaLabel="Increase value by 1"
        decrementButtonAriaLabel="Decrease value by 1"
        styles={styles}
        onChange={onChange}
      />
    </div>
  )
}
