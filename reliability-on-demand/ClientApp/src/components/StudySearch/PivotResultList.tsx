import axios from "axios"
import React, { useEffect, useState } from "react"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import { StudyConfig } from "../../models/study.model"
import { PivotResultHeader } from "./PivotResultHeader"
import { PivotResultRow } from "./PivotResultRow"

interface IPivotResultListProps {
    config: StudyConfig
}

// Responsibility: get pivots from backend and pass to PivotResultRow
export const PivotResultList = (props: IPivotResultListProps) => {
    const [pivotConfigs, setPivotConfigs] = useState<StudyPivotConfig[]>([])
    useEffect(() => {
        loadPivots(props.config.StudyConfigID)
    }, [props.config])

    const loadPivots = (studyConfigID: string) => {
        axios
            .get(`api/Data/GetPivotsAndScopesForStudyConfigID/${studyConfigID}`)
            .then((response) => {
                if (response) {
                    console.table(response.data)
                    setPivotConfigs(response.data as StudyPivotConfig[])
                } else setPivotConfigs([])
            })
    }

    const renderPivotResultRows =
        pivotConfigs.length > 0 ? (
            <div>
                <PivotResultHeader />
                {/* Show a list of pivots if configured */}
                {pivotConfigs.map((pivot: StudyPivotConfig) => {
                    return <PivotResultRow config={pivot} key={pivot.PivotKey} />
                })}
            </div>
        ) : (
            "No Pivots configured"
        )

    return <div>{renderPivotResultRows}</div>
}
