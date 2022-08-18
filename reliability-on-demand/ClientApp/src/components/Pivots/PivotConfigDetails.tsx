import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfig, StudyPivotConfig } from "../../models/filterexpression.model"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import { MessageBox } from "../helpers/MessageBox"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { azureFuncURL } from "../helpers/utils"
import { SavePivotConfigButton } from "./SavePivotConfigButton"
import { convertPivotInfoToOptions, generateCorrespondingStudyConfig } from "./service"

interface IPivotConfigDetailsProps {
    pivotSource: string
    StudyConfigID: number
}

export const PivotConfigDetails = (props: IPivotConfigDetailsProps) => {
    const [populationPivots, setPopulationPivots] = useState([])
    const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
    const [selectedItemConfigs, setSelectedItemConfigs] = useState<PopulationPivotConfig[]>([])
    const [selectedItemConfigsWithScope, setSelectedItemConfigsWithScope] = useState<
        PopulationPivotConfig[]
    >([])
    const [backendStatus, setBackendStatus] = useState("")

    useEffect(() => {
        // clear status message if it existed
        if (backendStatus !== "") setBackendStatus("")
        // get all pivots
        axios
            .get(`api/Data/GetPopulationPivots/${props.pivotSource}`)
            .then((response) => {
                if (response) setPopulationPivots(response.data)
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
                        setSelectedItems(ans) // set any user selections previously made, otherwise set defaults created by admin
                    }
                } else setSelectedItems([])
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [props.pivotSource, props.StudyConfigID])

    // callbacks
    const handleCallBack = (selections: IComboBoxOption[]) => {
        setSelectedItems(selections)
        setSelectedItemConfigs(
            generateCorrespondingStudyConfig(selections, populationPivots, props.StudyConfigID)
        )
        console.log(selectedItemConfigs)
    }

    const handleBackendStatus = (value: string) => {
        setBackendStatus(value)
    }

    const printFromCallBack = (PivotsWithScope: StudyPivotConfig[]) => {
        const newList = PivotsWithScope.map((pws) => {
            const newPivotConfig = {
                ...pws,
                AggregateBy: true,
                PivotSourceSubType: "AllMode",
            } as PopulationPivotConfig
            return newPivotConfig
        })
        setSelectedItemConfigsWithScope(newList)
        console.log(JSON.stringify(newList, null, 2))
    }

    const handleValidation = (callBackend: boolean) => {
        if (callBackend) {
            console.log("call backend to validate filter :) ")
            if (azureFuncURL) {
                console.log(`azure func URL = ${azureFuncURL}`)
                axios
                    .post(azureFuncURL, selectedItemConfigsWithScope)
                    .then((response) => {
                        if (response) {
                            console.log(`validated from Backend String = ${response.data}`)
                        } else console.log("no response from Backend Azure Function")
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
            console.log("no backend calls executed to validate filter expression")
        }
    }

    const showFilterExpressionIfPivotSelected =
        selectedItems.length > 0 ? (
            <div>
                <FilterExpressionDetailedList
                    studyPivotConfigs={selectedItemConfigs}
                    callBack={printFromCallBack}
                    callBackend={true}
                    validateExpCallBack={handleValidation}
                />
                <SavePivotConfigButton
                    StudyConfigID={props.StudyConfigID}
                    selectedPivots={selectedItemConfigsWithScope}
                    callbackStatus={handleBackendStatus}
                />
            </div>
        ) : (
            ""
        )

    return (
        <div>
            <MyMultiSelectComboBox
                options={convertPivotInfoToOptions(populationPivots, props.pivotSource)}
                callback={handleCallBack}
                label="Pivots"
                placeholder="type a pivot name to search OR select from the list"
                selectedItems={selectedItems}
            />
            {showFilterExpressionIfPivotSelected}
            {backendStatus === "" ? "" : <MessageBox message={backendStatus} />}
        </div>
    )
}
