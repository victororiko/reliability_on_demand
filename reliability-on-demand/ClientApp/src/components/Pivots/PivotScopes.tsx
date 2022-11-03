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

    const callAzureFunc = (input: StudyPivotConfig[], callBackendFlag: boolean) => {
        if (callBackendFlag) {
            if (azureFuncURL) {
                axios
                    .post(azureFuncURL, scopingAnswers)
                    .then((response) => {
                        if (response) {
                            console.debug(`validated from Backend String = ${response.data}`)
                        } else console.debug("no response from Backend Azure Function")
                    })
                    .catch((err) => {
                        console.error(`failed to call backend with error = ${err}`)
                    })
            } else {
                console.error(
                    "Azure Function URL missing - make sure you have a .env file added to ClientApp folder as mentioned in the README"
                )
            }
        } else {
            console.debug("no backend calls executed to validate filter expression")
        }
    }

    // render()
    const renderPivotScopes =
        props.userConfigs.length === 0 ? (
            "Please check Scope box for at least 1 pivot"
        ) : (
            <div>
                <MessageBox message="Note - you will need to touch the Scopes UI below to ensure that scopes are merged into configs" />
                <FilterExpressionDetailedList
                    studyPivotConfigs={scopingCandidates}
                    callBack={setNewlyCreatedScopes}
                    callBackend={true}
                    validateExpCallBack={callAzureFunc}
                />
                <DefaultButton text="Merge Scopes" onClick={pushScopedListUp} />
            </div>
        )

    return <div>{renderPivotScopes}</div>
}
