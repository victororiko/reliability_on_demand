import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { PivotConfigList } from "./PivotConfigList"
import { PivotScopes } from "./PivotScopes"
import { SavePivotConfigButton } from "./SavePivotConfigButton"
import { extractScopeByChecked, mergeScopesIntoConfigs, pushModelToCheckBoxes } from "./service"

interface IPivotAndScopeDetailsProps {
    showSaveButton: boolean
    selectedItemConfigs: PopulationPivotConfigUI[]
    finalList: any
    studyConfigID: number
}

export const PivotAndScopeDetails = (props: IPivotAndScopeDetailsProps) => {
    // state
    const [userConfigs, setUserConfigs] = useState<PopulationPivotConfigUI[]>([])
    const [scopingCandidates, setScopingCandidates] = useState<PopulationPivotConfigUI[]>([])
    const [isValidated, setIsValidated] = useState<Boolean>(false)

    // effects
    useEffect(() => {
        // add checkbox placeholders and values to input
        firstLoad(props.selectedItemConfigs)
    }, [props.selectedItemConfigs])

    const firstLoad = (list: PopulationPivotConfigUI[]) => {
        const updatedList = pushModelToCheckBoxes(list)
        loadState(updatedList)
    }

    const loadState = (list: PopulationPivotConfigUI[]) => {
        setUserConfigs(list)
        const smallerList = extractScopeByChecked(list)
        setScopingCandidates(smallerList)
    }

    // callbacks
    const updateStateFromPivotList = (list: PopulationPivotConfigUI[]) => {
        loadState(list)
    }

    const handleUpdateScopes = (list: PopulationPivotConfigUI[], isValidatedParam: boolean) => {
        const newList = mergeScopesIntoConfigs(userConfigs, list)
        setUserConfigs(newList)
        setIsValidated(isValidatedParam)
    }

    // always call
    props.finalList(userConfigs)

    // render()
    const renderScopes = scopingCandidates && scopingCandidates.length > 0 && (
        <PivotScopes
            userConfigs={scopingCandidates}
            updateScopes={handleUpdateScopes}
            allConfigs={userConfigs}
        />
    )

    const renderSaveButton =
        props.showSaveButton && isValidated && userConfigs.length > 0 ? (
            <SavePivotConfigButton
                selectedPivots={userConfigs}
                studyConfigID={props.studyConfigID}
            />
        ) : (
            ""
        )

    return (
        <div>
            <PivotConfigList
                studyPivotConfigs={userConfigs}
                updateConfigs={updateStateFromPivotList}
            />
            {renderScopes}
            {renderSaveButton}
        </div>
    )
}
