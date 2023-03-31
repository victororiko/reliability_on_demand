import { TextField } from "@fluentui/react"
import * as React from "react"
import { getErrorMessage } from "./utils"

interface IMyTextFieldProps {
    label: string
    placeholder: string
    validateOnLoad: boolean
    textFieldValue: string
    callback: any
    isRequired: boolean
}

export const MyTextField = (props: IMyTextFieldProps) => {
    const [currentTextFieldValue, setCurrentTextFieldValue] = React.useState(props.label)
    const handleTextInput = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setCurrentTextFieldValue(newValue || "")
            props.callback(newValue)
        },
        [props]
    )

    // For client side error - checks if the textfield is empty, displays the error.
    const onGetErrorMessageHandler = (value: string) => {
        return getErrorMessage(value, props.callback)
    }

    const control = props.isRequired ? (
        <div>
            <TextField
                label={props.label}
                required
                placeholder={props.placeholder}
                validateOnLoad={props.validateOnLoad}
                value={currentTextFieldValue}
                onChange={handleTextInput}
                validateOnFocusOut
                aria-label={props.label}
                onGetErrorMessage={(value) => {
                    return onGetErrorMessageHandler(value)
                }}
            />
        </div>
    ) : (
        <div>
            <TextField
                label={props.label}
                placeholder={props.placeholder}
                validateOnLoad={props.validateOnLoad}
                value={currentTextFieldValue}
                onChange={handleTextInput}
                validateOnFocusOut
                aria-label={props.label}
            />
        </div>
    )

    React.useEffect(() => {
        setCurrentTextFieldValue(props.textFieldValue || "")
    }, [props.textFieldValue])

    return <div>{control}</div>
}
