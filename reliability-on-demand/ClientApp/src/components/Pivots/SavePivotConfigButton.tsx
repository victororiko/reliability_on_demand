import { PrimaryButton } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { sanitizeList, setCorrectStudyConfigID } from "./service"

type Props = {
    selectedPivots: PopulationPivotConfigUI[]
    studyConfigID: number
}

/**
 * Captures, sanitizes, and saves list of pivot configs
 * @param props list of pivots, study config id
 * @returns Save Button or updated status
 */
export const SavePivotConfigButton = (props: Props) => {
    const [status, setStatus] = useState<string>("")
    const [finalList, setFinalList] = useState<PopulationPivotConfigUI[]>([])

    useEffect(() => {
        const sanitizedList = sanitizeList(props.selectedPivots)
        setFinalList(sanitizedList)
        setStatus("")
    }, [JSON.stringify(props.selectedPivots)])

    const handleClick = () => {
        const pivotsWithStudyConfigID = setCorrectStudyConfigID(finalList, props.studyConfigID)
        // save all generated PivotConfigs - one by one
        axios
            .post("api/Data/AddOrUpdatePivotConfig/", pivotsWithStudyConfigID)
            .then((response) => {
                setStatus(`Pivot Configs saved`)
            })
            .catch((exception) => {
                setStatus(`Pivot Configs were NOT saved`)
                return console.error(exception)
            })
    }

    const renderUI = status === "" ? <PrimaryButton text="Save" onClick={handleClick} /> : status

    return <div>{renderUI}</div>
}
