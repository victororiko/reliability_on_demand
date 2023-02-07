import React from "react"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { MySingleSelectComboBox } from "../../helpers/MySingleSelectComboBox"
import { useStudyTimeFrameQuery } from "../service"

interface ITimeFrameDropdownProps {
    StudyKeyInstanceGuidStr: string
    changeTimeFrameCallback: (newGuidStr: string) => void
}

export const TimeFrameDropdown = (props: ITimeFrameDropdownProps) => {
    const { isError, error, isLoading, data } = useStudyTimeFrameQuery(
        props.StudyKeyInstanceGuidStr
    )

    if (isError)
        return <MessageBox message={`Failed to get Study Time Frames. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Study Time Frames" />

    // generate dropdown from raw data
    const options = data.map((item: any) => {
        const prettyStartTime = new Date(item.StartTime).toLocaleString()
        const prettyEndTime = new Date(item.EndTime).toLocaleString()
        return {
            key: item.StudyKeyInstanceGuid,
            text: `${prettyStartTime} - ${prettyEndTime}`,
        }
    })

    const selectedTimeFrame = options.find((item: any) => {
        return item.key === props.StudyKeyInstanceGuidStr
    })

    // callback
    const handleTimeFrameChange = (selection: any) => {
        const parsedGuidStr = selection.key
        props.changeTimeFrameCallback(parsedGuidStr)
    }

    return (
        <div>
            <MySingleSelectComboBox
                options={options}
                callback={handleTimeFrameChange}
                label="Time Frame"
                placeholder="No records to display"
                selectedItem={selectedTimeFrame}
            />
        </div>
    )
}
