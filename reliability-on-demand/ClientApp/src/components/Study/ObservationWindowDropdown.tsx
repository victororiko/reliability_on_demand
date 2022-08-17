import React, { useEffect, useState } from "react"
import { IDropdownOption } from "@fluentui/react"
import { StudyConfig, getObservationWindowSelectionFromStudy } from "../../models/study.model"

import { MyDropdown } from "../helpers/MyDropdown"
import { hardCodedObservationWindows } from "../helpers/utils"

interface Props {
    currentStudy?: StudyConfig
    callBack: any
}

export const ObservationWindowDropdown = (props: Props) => {
    const [selection, setSelection] = useState<IDropdownOption | undefined>(
        getObservationWindowSelectionFromStudy(hardCodedObservationWindows, props?.currentStudy)
    )

    useEffect(() => {
        const ans = getObservationWindowSelectionFromStudy(
            hardCodedObservationWindows,
            props?.currentStudy
        )
        setSelection(ans)
    }, [props.currentStudy])

    const handleObservationWindowChange = (value: IDropdownOption) => {
        props.callBack(value.key)
        setSelection(value)
    }

    return (
        <MyDropdown
            data={hardCodedObservationWindows}
            enabled
            handleOptionChange={handleObservationWindowChange}
            label="Observation Window"
            placeholder="Please select an observation window for your study"
            required
            selectedOption={selection}
        />
    )
}
