import React from "react"
import { PrimaryButton } from "@fluentui/react"

type Props = {
    callback: any
}

export const UpdateStudyButton = (props: Props) => {
    const handleClick = () => {
        props.callback()
    }
    return <PrimaryButton text="Update" onClick={handleClick} />
}
