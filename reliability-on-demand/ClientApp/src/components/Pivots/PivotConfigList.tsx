import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { PivotConfigListRow } from "./PivotConfigListRow"
import {
    pushAggByCheckboxToModel,
    pushScopeByCheckboxToModel,
    updateFromChild,
    getUniquePivotKeys,
} from "./service"

interface IPivotConfigListProps {
    studyPivotConfigs: PopulationPivotConfigUI[] // list of pivotConfigs selected by user in the dropdown in parent component
    updateConfigs: any
}

export const PivotConfigList = (props: IPivotConfigListProps) => {
    const [configsWithCheckboxPlaceholders, setConfigsWithCheckboxPlaceholders] = useState<
        PopulationPivotConfigUI[]
    >([])
    const [uniquePivotConfigs, setUniquePivotConfigs] = useState<PopulationPivotConfigUI[]>([])

    useEffect(() => {
        // mount logic - update each item with Checkbox states
        setConfigsWithCheckboxPlaceholders(props.studyPivotConfigs)
        setUniquePivotConfigs(getUniquePivotKeys(props.studyPivotConfigs))
    }, [props.studyPivotConfigs])

    const snapToCheckboxUpdates = (configFromChild: PopulationPivotConfigUI) => {
        const newList = updateFromChild(configsWithCheckboxPlaceholders, configFromChild)
        // update model
        const aggByList = pushAggByCheckboxToModel(newList)
        const aggByScopeByList = pushScopeByCheckboxToModel(aggByList)
        setConfigsWithCheckboxPlaceholders(aggByScopeByList)
        props.updateConfigs(aggByScopeByList)
    }

    return (
        <div>
            {uniquePivotConfigs.map((item: PopulationPivotConfigUI) => {
                return (
                    <PivotConfigListRow
                        config={item}
                        updateConfig={snapToCheckboxUpdates}
                        key={item.PivotKey}
                    />
                )
            })}
        </div>
    )
}
