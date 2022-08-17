import { PrimaryButton } from "@fluentui/react"
import React from "react"

type Props = {
    callback: any
}

export const CancelButton = (props: Props) => {
    const handleClick = () => {
        props.callback()
    }
    return <PrimaryButton text="Cancel" onClick={handleClick} />
}
