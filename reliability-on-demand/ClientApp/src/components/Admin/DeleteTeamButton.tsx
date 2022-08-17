import React from "react"
import { PrimaryButton } from "@fluentui/react"
import "./AdminPageStyleSheet.css"

interface Props {
    callBack: any
}

export const DeleteTeamButton = (props: Props) => {
    return (
        <div>
            <PrimaryButton
                text="Delete Team"
                onClick={props.callBack}
                className="button"
                allowDisabledFocus
            />
        </div>
    )
}
