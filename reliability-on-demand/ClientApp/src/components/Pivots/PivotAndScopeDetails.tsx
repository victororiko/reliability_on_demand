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
}

export const PivotAndScopeDetails = (props: IPivotAndScopeDetailsProps) => {
    // state
    const [userConfigs, setUserConfigs] = useState<PopulationPivotConfigUI[]>([])
    const [scopingCandidates, setScopingCandidates] = useState<PopulationPivotConfigUI[]>([])

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

    const handleUpdateScopes = (list: PopulationPivotConfigUI[]) => {
        const newList = mergeScopesIntoConfigs(userConfigs, list)
        setUserConfigs(newList)
    }

    // always call
    props.finalList(userConfigs)

    // render()
    const renderScopes = scopingCandidates && scopingCandidates.length > 0 && (
        <PivotScopes userConfigs={scopingCandidates} updateScopes={handleUpdateScopes} />
    )

    const renderSaveButton =
        props.showSaveButton && userConfigs.length > 0 ? (
            <SavePivotConfigButton selectedPivots={userConfigs} />
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
