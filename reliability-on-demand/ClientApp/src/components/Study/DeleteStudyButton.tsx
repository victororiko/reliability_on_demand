import { PrimaryButton } from "@fluentui/react"
import React from "react"

type Props = {
    callback: any
}

export const DeleteStudyButton = (props: Props) => {
    const handleClick = () => {
        props.callback()
    }
    return <PrimaryButton text="Delete" onClick={handleClick} />
}
