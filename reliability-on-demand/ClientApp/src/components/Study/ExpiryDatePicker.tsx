import React, { useEffect } from "react"
import { DatePicker, defaultDatePickerStrings, mergeStyleSets } from "@fluentui/react"
import { useConst } from "@fluentui/react-hooks"
import { StudyConfig, getDefaultExpiryDate } from "../../models/study.model"

interface Props {
    currentStudy?: StudyConfig
    callBack: any
}

const controlClass = mergeStyleSets({
    control: {
        margin: "0 0 15px 0",
        maxWidth: "300px",
    },
})

export const ExpiryDatePicker = (props: Props) => {
    const today = useConst(new Date(Date.now()))
    const [value, setValue] = React.useState<Date | undefined>(
        new Date(props.currentStudy?.Expiry || getDefaultExpiryDate())
    )

    useEffect(() => {
        setValue(new Date(props.currentStudy?.Expiry || getDefaultExpiryDate()))
    }, [props.currentStudy])

    const onChange = (dateSelection: any) => {
        setValue(dateSelection as Date)
        props.callBack(dateSelection)
    }

    return (
        <DatePicker
            label="Select an Expiry Date"
            value={value || getDefaultExpiryDate()}
            strings={defaultDatePickerStrings}
            isRequired={true}
            className={controlClass.control} // make sure we don't expand to full width
            minDate={today}
            onSelectDate={onChange}
            showGoToToday={true}
        />
    )
}
