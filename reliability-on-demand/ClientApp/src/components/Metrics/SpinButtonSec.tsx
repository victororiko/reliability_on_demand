import { ISpinButtonStyles, Position, SpinButton } from "@fluentui/react"
import React, { useEffect } from "react"

interface Props {
    defaultSecs: string
    callback: any
}

// By default the field grows to fit available width. Constrain the width instead.
const styles: Partial<ISpinButtonStyles> = { spinButtonWrapper: { width: 75 } }

export const SpinButtonSec = (props: Props) => {
    const [value, setValue] = React.useState<string>("0")

    useEffect(() => {
        setValue(props.defaultSecs)
        return () => {}
    }, [props.defaultSecs])

    const onChange = (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
        if (newValue !== undefined) {
            setValue(newValue)
            props.callback(newValue)
        }
    }

    return (
        <div>
            <SpinButton
                label="Seconds"
                value={value}
                labelPosition={Position.top}
                min={0}
                max={60}
                step={1}
                incrementButtonAriaLabel="Increase value by 1"
                decrementButtonAriaLabel="Decrease value by 1"
                styles={styles}
                onChange={onChange}
            />
        </div>
    )
}
