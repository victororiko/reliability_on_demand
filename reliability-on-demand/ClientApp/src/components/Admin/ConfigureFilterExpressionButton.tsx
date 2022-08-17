import React from "react"
import { DefaultButton } from "@fluentui/react"

type Props = {
    callBack: any
}

export const ConfigureFilterExpressionButton = (props: Props) => {
    const handleClick = () => {
        props.callBack()
    }

    return (
        <DefaultButton
            text="Configure Filter Expression"
            onClick={handleClick}
            allowDisabledFocus
        />
    )
}
