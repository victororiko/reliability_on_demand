import React from "react"
import { DefaultButton, TooltipHost, Label } from "@fluentui/react"
import { Pivot } from "../../models/pivot.model"

type Props = {
    ButtonName: string
    callBack: any
    dataSaved: boolean
    pivots: Pivot[]
}

export const AddOrUpdateButton = (props: Props) => {
    const handleClick = () => {
        props.callBack(props.pivots)
    }

    const saveLabel = !props.dataSaved ? (
        ""
    ) : (
        <div>
            <Label>Data has been saved successfully</Label>
        </div>
    )

    return (
        <div>
            <TooltipHost content="Click to save all the selected configuration">
                <div>
                    <DefaultButton
                        text={props.ButtonName}
                        onClick={handleClick}
                        allowDisabledFocus
                        disabled={false}
                        checked={false}
                    />
                </div>
            </TooltipHost>
            {saveLabel}
        </div>
    )
}
