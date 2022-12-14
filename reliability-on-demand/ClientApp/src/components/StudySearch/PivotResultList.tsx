import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfig } from "../../models/filterexpression.model"
import { StudyConfig } from "../../models/study.model"
import { MyTable } from "../helpers/MyTable"

interface IPivotResultListProps {
    config: StudyConfig
}

// Responsibility: get pivots from backend and pass to PivotResultRow
export const PivotResultList = (props: IPivotResultListProps) => {
    const [pivotConfigs, setPivotConfigs] = useState<PopulationPivotConfig[]>([])
    useEffect(() => {
        loadPivots(props.config.StudyConfigID)
    }, [props.config])

    const loadPivots = (studyConfigID: string) => {
        axios
            .get(`api/Data/GetPivotsAndScopesForStudyConfigID/${studyConfigID}`)
            .then((response) => {
                if (response) {
                    setPivotConfigs(response.data as PopulationPivotConfig[])
                } else setPivotConfigs([])
            })
    }

    const pivotsModified = pivotConfigs.map((item: PopulationPivotConfig) => {
        const pivotSource = item.PivotKey.split("_")[0]
        const pivotName = item.PivotKey.split("_")[1]
        const pivotOperator = item.PivotOperator
        const pivotScopeValue = item.PivotScopeValue
        const pivotScopeStr: string =
            pivotOperator && pivotScopeValue
                ? `${pivotName} ${pivotOperator} ${pivotScopeValue}`
                : ""
        return {
            "Pivot Source": pivotSource,
            "Pivot Name": pivotName,
            "Pivot Scope": pivotScopeStr,
            "Aggregate By": item.AggregateBy ? "true" : "false",
        }
    })

    const renderPivotResultRows =
        pivotConfigs.length > 0 ? (
            <MyTable data={pivotsModified} renderFilter={true} />
        ) : (
            "No Pivots configured"
        )

    return <div>{renderPivotResultRows}</div>
}
