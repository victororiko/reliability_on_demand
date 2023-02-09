import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI, StudyPivotConfig } from "../../models/filterexpression.model"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import {
    getAggregateByCheckedValue,
    getAggregateByValue,
    getScopeCheckedValue,
    setCorrectUIInputType,
} from "./service"

interface IPivotScopesProps {
    userConfigs: PopulationPivotConfigUI[]
    allConfigs: PopulationPivotConfigUI[]
    updateScopes: any
}
export const PivotScopes = (props: IPivotScopesProps) => {
    // state
    const [scopingCandidates, setScopingCandidates] = useState<PopulationPivotConfigUI[]>([])
    const [callFilterExpBackend, setCallFilterExpBackend] = React.useState<boolean>(true)

    useEffect(() => {
        setScopingCandidates(props.userConfigs)
        setCallFilterExpBackend(true)
    }, [JSON.stringify(props.userConfigs)])

    // handlers
    const setNewlyCreatedScopes = (PivotsWithScope: StudyPivotConfig[], callBackend: boolean) => {
        const newList = PivotsWithScope.map((pws) => {
            const newPivotConfig = {
                ...pws,
                AggregateBy: getAggregateByValue(props.allConfigs, pws),
                AggregateByChecked: getAggregateByCheckedValue(props.allConfigs, pws),
                ScopeByChecked: getScopeCheckedValue(props.allConfigs, pws),
                PivotSourceSubType: "AllMode",
            } as PopulationPivotConfigUI
            return newPivotConfig
        })
        setScopingCandidates(setCorrectUIInputType(newList, props.userConfigs))
        setCallFilterExpBackend(callBackend)
    }

    const pushScopedListUp = (input: PopulationPivotConfigUI[], isValidated: boolean) => {
        props.updateScopes(input, isValidated)
    }

    const validateFilterExpression = (input: StudyPivotConfig[], isValidated: boolean) => {
        if (isValidated) {
            const newList = input.map((pws) => {
                const newPivotConfig = {
                    ...pws,
                    AggregateBy: getAggregateByValue(scopingCandidates, pws),
                    AggregateByChecked: getAggregateByCheckedValue(scopingCandidates, pws),
                    ScopeByChecked: getScopeCheckedValue(scopingCandidates, pws),
                    PivotSourceSubType: "AllMode",
                } as PopulationPivotConfigUI
                return newPivotConfig
            })
            pushScopedListUp(newList, isValidated)
        }
    }

    // render()
    const renderPivotScopes =
        props.userConfigs.length === 0 ? (
            "Please check Scope box for at least 1 pivot"
        ) : (
            <div>
                <FilterExpressionDetailedList
                    studyPivotConfigs={scopingCandidates}
                    callBack={setNewlyCreatedScopes}
                    callBackend={callFilterExpBackend}
                    validateExpCallBack={validateFilterExpression}
                />
            </div>
        )

    return <div>{renderPivotScopes}</div>
}
