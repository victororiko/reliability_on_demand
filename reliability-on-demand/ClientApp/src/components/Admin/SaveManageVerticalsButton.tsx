import React from "react"
import { DefaultButton, Label, IComboBoxOption } from "@fluentui/react"
import { StudyTypeConfig } from "../../models/study.model"

type Props = {
    callBack: any
    hasSaved: boolean
    StudyType: string
    SelectedVerticals: IComboBoxOption[]
}

export const SaveManageVerticalsButton = (props: Props) => {
    const handleClick = () => {
        const dataToBeSaved: StudyTypeConfig = {
            StudyType: props.StudyType,
            Verticals: [],
        }
        props.SelectedVerticals.forEach((e) => {
            dataToBeSaved.Verticals.push(e.text)
        })
        props.callBack(dataToBeSaved)
    }

    const saveLabel = !props.hasSaved ? (
        ""
    ) : (
        <div>
            <Label>Data has been saved successfully</Label>
        </div>
    )

    return (
        <div>
            <div>
                <DefaultButton
                    text="Save"
                    onClick={handleClick}
                    allowDisabledFocus
                    disabled={props.hasSaved}
                    checked={false}
                />
            </div>
            {saveLabel}
        </div>
    )
}
