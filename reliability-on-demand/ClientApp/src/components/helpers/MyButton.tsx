import { DefaultButton, PrimaryButton } from "@fluentui/react"
import React from "react"
import { SimplifiedButtonType } from "./utils"

interface IMyButtonProps {
    buttonType: SimplifiedButtonType
    text: string
    callback: any
}

export const MyButton = (props: IMyButtonProps) => {
    const handleClick = () => {
        props.callback()
    }

    return (
        <div>
            {props.buttonType === SimplifiedButtonType.Other ? (
                <DefaultButton text={props.text ?? "Default Button"} onClick={handleClick} />
            ) : (
                <PrimaryButton text={props.text ?? "Default Button"} onClick={handleClick} />
            )}
        </div>
    )
}
