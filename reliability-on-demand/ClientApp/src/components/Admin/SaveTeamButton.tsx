import React from "react"
import { PrimaryButton } from "@fluentui/react"

interface Props {
    ButtonName: string
    ToDisable: boolean
    callBack: any
}

export const SaveTeamButton = (props: Props) => {
    return (
        <PrimaryButton
            text={props.ButtonName}
            onClick={props.callBack}
            disabled={props.ToDisable}
            allowDisabledFocus
        />
    )
}
