import { DefaultButton, TooltipHost } from "@fluentui/react"
import React from "react"

type Props = {
    hidecallBack: any
    changepivotcallBack: any
}

export const ConfigureVerticalButton = (props: Props) => {
    const [buttonClicked, setButtonClicked] = React.useState<Boolean>(false)

    const handleClick = () => {
        setButtonClicked(!buttonClicked)
        if (!buttonClicked) props.changepivotcallBack()
        else props.hidecallBack()
    }

    return (
        <TooltipHost content="Press this button if all the required verticals are selected and you would like to configure them one by one">
            <DefaultButton
                text={buttonClicked ? "Hide Pivot Configuration" : "Change Pivot Configuration"}
                onClick={handleClick}
                allowDisabledFocus
            />
        </TooltipHost>
    )
}
