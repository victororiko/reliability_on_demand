import React from "react"
import { Toggle } from "@fluentui/react"

interface Props {
    value: boolean
    label: string
    callBack: any
}

export const MyToggle = (props: Props) => {
    const onToggleChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        props.callBack(checked)
    }

    return (
        <Toggle
            label={props.label}
            checked={props.value}
            onText="On"
            offText="Off"
            onChange={onToggleChange}
        />
    )
}
