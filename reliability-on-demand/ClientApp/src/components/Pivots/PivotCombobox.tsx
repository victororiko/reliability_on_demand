import { IComboBoxOption, Stack } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfig, PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { containerStackTokens } from "../helpers/Styles"
import { PivotAndScopeDetails } from "./PivotAndScopeDetails"
import {
    convertPivotInfoToOptions,
    generateCorrespondingStudyConfig,
    getUniqueOptions,
    mergeLists
} from "./service"

interface IPivotComboboxProps {
    pivotSource: string
    StudyConfigID: number
    showSaveButton: boolean
    finalList: any
}

/**
 * 
 * @param {string} pivotSource - the name of the pivot source (e.g. "Population", "Usage")
 * @param {number} StudyConfigID - used for identifying a study config (note: -1 is used for default study)
 * @param {boolean} showSaveButton - show/hide the save button. Hide the save button when you only want the list of study pivot configs, like when you are searching by pivots
 * @param {any} finalList - callback function that returns the final list of study pivots configured by the user
 * @returns React component that: 
 * 1. gets all pivots from backend based on pivot source specified (e.g. "Population", "Usage")
 * 2. gets all user selections from backend based on pivot source and StudyConfigID
 * 3. merges the two lists and passes them to the MyMultiSelectComboBox component
 * 4. if any of the pivots have a scope configured, then display the PivotAndScopeDetails component
 * 5. if the user clicks the save button, then save the user selections to the backend
 */
export const PivotCombobox = (props: IPivotComboboxProps) => {
    // state
    const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
    const [populationPivots, setPopulationPivots] = useState<PopulationPivotConfig[]>([])
    const [selectedItemConfigs, setSelectedItemConfigs] = useState<PopulationPivotConfig[]>([])

    // useEffect()
    useEffect(() => {
        // get all pivots
        axios
            .get(`api/Data/GetPopulationPivots/${props.pivotSource}`)
            .then((response) => {
                if (response) setPopulationPivots(response.data as PopulationPivotConfig[])
                else setPopulationPivots([])
            })
            .catch((exception) => {
                return console.error(exception)
            })
        // set user selections
        axios
            .get(
                `api/Data/GetUserPivotConfigs/PivotSource/${props.pivotSource}/StudyConfigID/${props.StudyConfigID}`
            )
            .then((response) => {
                if (response) {
                    // these nested if statements are required to set the right state if we get no records from backend
                    if (response.data === "") {
                        setSelectedItemConfigs([])
                        setSelectedItems([])
                    } else {
                        // save raw SQL
                        setSelectedItemConfigs(response.data as PopulationPivotConfig[])
                        // map to Dropdown options
                        const arr = response.data
                        const ans = arr.map((item: any) => {
                            const rObj = {
                                ...item,
                                key: item.PivotKey,
                                text: item.PivotName, // using [0] because the array will only have 1 object - SQL weirdness
                            }
                            return rObj
                        })
                        setSelectedItems(getUniqueOptions(ans)) // set any user selections previously made, otherwise set defaults created by admin
                    }
                } else setSelectedItems([])
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [props.pivotSource, props.StudyConfigID])

    // callbacks
    const handleCallBack = (selections: IComboBoxOption[]) => {
        setSelectedItems(getUniqueOptions(selections))
        const mergedList = mergeLists(selectedItemConfigs, populationPivots)
        setSelectedItemConfigs(
            generateCorrespondingStudyConfig(selections, mergedList, props.StudyConfigID)
        )
    }

    const handleFinalList = (list: PopulationPivotConfigUI[]) => {
        props.finalList(list)
    }

    const renderPivotAndScopeDetails =
        selectedItemConfigs.length === 0 ? (
            ""
        ) : (
            <PivotAndScopeDetails
                {...props}
                selectedItemConfigs={selectedItemConfigs as PopulationPivotConfigUI[]}
                finalList={handleFinalList}
                studyConfigID={props.StudyConfigID}
                key={JSON.stringify(selectedItemConfigs)}
            />
        )

    // render()
    return (
        <div>
            <Stack tokens={containerStackTokens}>
                <MyMultiSelectComboBox
                    options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
                    callback={handleCallBack}
                    label="Pivots"
                    placeholder="type a pivot name to search OR select from the list"
                    selectedItems={selectedItems}
                />
                {renderPivotAndScopeDetails}
            </Stack>
        </div>
    )
}
