import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfig, PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { PivotAndScopeDetails } from "./PivotAndScopeDetails"
import {
    convertPivotInfoToOptions,
    generateCorrespondingStudyConfig,
    mergeLists,
    getUniqueOptions,
} from "./service"

interface IPivotComboboxProps {
    pivotSource: string
    StudyConfigID: number
    showSaveButton: boolean
    finalList: any
}

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
                                text: item["dbo.RELPivotInfo"][0].PivotName, // using [0] because the array will only have 1 object - SQL weirdness
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
            />
        )

    // render()
    return (
        <div>
            <MyMultiSelectComboBox
                options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
                callback={handleCallBack}
                label="Pivots"
                placeholder="type a pivot name to search OR select from the list"
                selectedItems={selectedItems}
            />
            {renderPivotAndScopeDetails}
        </div>
    )
}
