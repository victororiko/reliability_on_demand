import { ISpinButtonStyles, Position, SpinButton } from '@fluentui/react'
import React, { useEffect } from 'react'

interface Props {
  defaultMins: string
  callback: any
}

// By default the field grows to fit available width. Constrain the width instead.
const styles: Partial<ISpinButtonStyles> = { spinButtonWrapper: { width: 200 } }

export const SpinButtonMins = (props: Props) => {
  const [value, setValue] = React.useState<string>('0')

  useEffect(() => {
    setValue(props.defaultMins)
    return () => {}
  }, [props.defaultMins])

  const onChange = (
    event: React.SyntheticEvent<HTMLElement>,
    newValue?: string
  ) => {
    if (newValue !== undefined) {
      setValue(newValue)
      props.callback(newValue)
    }
  }

  return (
    <div>
      <SpinButton
        label="Minutes"
        value={value}
        min={0}
        max={153722867280912} // max value allowed in SQL
        step={1}
        onChange={onChange}
        incrementButtonAriaLabel="Increase value by 1"
        decrementButtonAriaLabel="Decrease value by 1"
        styles={styles}
        labelPosition={Position.top}
      />
    </div>
  )
}
