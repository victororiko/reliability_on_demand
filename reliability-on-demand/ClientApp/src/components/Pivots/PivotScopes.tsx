import { DefaultButton } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI, StudyPivotConfig } from "../../models/filterexpression.model"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import { MessageBox } from "../helpers/MessageBox"
import { azureFuncURL } from "../helpers/utils"
import { getAggregateByCheckedValue, getAggregateByValue, getScopeCheckedValue } from "./service"

interface IPivotScopesProps {
    userConfigs: PopulationPivotConfigUI[]
    updateScopes: any
}

export const PivotScopes = (props: IPivotScopesProps) => {
    // state
    const [scopingCandidates, setScopingCandidates] = useState<PopulationPivotConfigUI[]>([])
    const [scopingAnswers, setScopingAnswers] = useState<PopulationPivotConfigUI[]>([])

    useEffect(() => {
        setScopingCandidates(props.userConfigs)
    }, [JSON.stringify(props.userConfigs)])

    // handlers
    const setNewlyCreatedScopes = (PivotsWithScope: StudyPivotConfig[]) => {
        const newList = PivotsWithScope.map((pws) => {
            const newPivotConfig = {
                ...pws,
                AggregateBy: getAggregateByValue(scopingCandidates, pws),
                AggregateByChecked: getAggregateByCheckedValue(scopingCandidates, pws),
                ScopeByChecked: getScopeCheckedValue(scopingCandidates, pws),
                PivotSourceSubType: "AllMode",
            } as PopulationPivotConfigUI
            return newPivotConfig
        })
        setScopingAnswers(newList)
    }

    const pushScopedListUp = () => {
        props.updateScopes(scopingAnswers)
    }

    const validateFilterExpression = (input: StudyPivotConfig[], isValidated: boolean) => {
        if (isValidated) {
            pushScopedListUp()
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
                    callBackend={true}
                    validateExpCallBack={validateFilterExpression}
                />
            </div>
        )

    return <div>{renderPivotScopes}</div>
}
