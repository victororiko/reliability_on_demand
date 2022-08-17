import { IComboBoxOption, selectProperties } from "@fluentui/react"
import axios from "axios"
import * as React from "react"
import { useEffect, useState } from "react"
import { Loading } from "../helpers/Loading"
import { AllSourceType } from "../helpers/utils"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { Pivot } from "../../models/pivot.model"
import { convertToPivot, AddNewSelectedPivots, getMode, getUniquePivotKeyPairs } from "./helper"
import { PivotsDetailedList } from "./PivotsDetailedList"
import { ConfigureFilterExpressionButton } from "./ConfigureFilterExpressionButton"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import { SaveManagePivots } from "./SaveManagePivots"
import {
    getDataToSaveUsingPivot,
    getUniqueMappedPivotWithScopeFilter,
    getFilterPivots,
} from "../FailureCurveSection/service"

export interface IManagePivotsProps {}

// Added randomly to check how pivots switching looks.
// Will be removed in next PR to implement the UI for this.
export const ManagePivots = (props: IManagePivotsProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [sources, setSources] = useState<IComboBoxOption[]>([])
    const [selectedSource, setSelectedSource] = useState<IComboBoxOption>()
    const [allPivots, setAllPivots] = useState<IComboBoxOption[]>([])
    const [selectedPivotsPair, setSelectedPivotsPair] = useState<IComboBoxOption[]>([])
    const [selectedPivots, setSelectedPivots] = useState<Pivot[]>([])
    const [selectedPivotsSet, setSelectedPivotsSet] = useState<Pivot[]>([])
    const [sourceSelected, setSourceSelected] = useState<Boolean>(false)
    const [configureFilterClicked, setConfigureFilterClicked] = useState<Boolean>(false)
    const [pivotStudyConfig, setPivotStudyConfig] = useState<StudyPivotConfig[]>([])
    const [callFilterExpBackend, setCallFilterExpBackend] = useState<boolean>(true)
    const [isValidated, setIsValidated] = useState<Boolean>(false)
    const [dataSaved, setDataSaved] = React.useState<boolean>(false)
    const [finalData, setFinalData] = React.useState<Pivot[]>([])
    const [mode, setMode] = React.useState<string>("")

    useEffect(() => {
        setSourceSelected(false)
        setLoading(true)
        axios
            .get(`api/Data/GetAllSourcesForGivenSourceType/${AllSourceType}`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    const ans = arr.map((item: any) => {
                        const rObj = {
                            key: item.PivotSource,
                            text: item.PivotSource,
                        }
                        return rObj
                    })
                    setSources(ans) // force combobox to show placeholder text by default
                } else {
                    setSources([])
                }
                setLoading(false)
                setSelectedSource(undefined) // let the user select a pivot source at each render
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [])

    const getAllPivotsForASource = (source: string) => {
        axios
            .get(`api/Data/GetPivotsForGivenSource/${source}`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    const ans = arr.map((item: any) => {
                        const rObj = {
                            key: `${item.PivotKey};${item.UIInputDataType};${item.ADLDataType}`,
                            text: item.PivotSourceColumnName,
                        }
                        return rObj
                    })
                    setAllPivots(ans) // force combobox to show placeholder text by default
                } else {
                    setAllPivots([])
                }
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const getAllConfiguredPivotsForASource = (source: string) => {
        axios
            .get(`api/Data/GetAdminConfiguredPivotsData/${source}`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    setSelectedPivotsPair(getUniquePivotKeyPairs(arr))
                    setSelectedPivots(convertToPivot(arr))
                    setSelectedPivotsSet(getUniqueMappedPivotWithScopeFilter(arr, -1))
                } else {
                    setSelectedPivotsSet([])
                    setSelectedPivots([])
                    setSelectedPivotsPair([])
                }
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const onSourceSelected = (input: IComboBoxOption) => {
        setSelectedSource(input)
        getAllPivotsForASource(input.key.toString())
        getAllConfiguredPivotsForASource(input.key.toString())
        setSourceSelected(true)
        setMode(getMode(input))
    }

    const onPivotDetailedlistUpdate = (input: any) => {
        setSelectedPivotsSet(input)
    }

    const onPivotMultiSelectUpdate = (input: IComboBoxOption[]) => {
        setSelectedPivotsPair(input)
        const temp: Pivot[] = []
        // Adding the rows that from detailed list input that are still selected
        // Also filter the deselected pivots
        for (const ele of selectedPivotsSet) {
            for (const e of input) {
                if (ele.PivotKey === e.key.toString().split(";")[0]) {
                    temp.push(ele)
                    break
                }
            }
        }

        // Add new selected checkbox
        const keys: string[] = []
        for (const ele of input) keys.push(ele.key.toString())

        const updatedPivotTable = AddNewSelectedPivots(keys, temp)
        setSelectedPivotsSet(updatedPivotTable)
    }

    const onConfigureFilterExp = () => {
        setConfigureFilterClicked(true)
        setCallFilterExpBackend(true)
        setPivotStudyConfig(getFilterPivots(selectedPivots, selectedPivotsSet, -1))
    }

    const onFilterExpUpdate = (input: any, flag: boolean) => {
        setPivotStudyConfig(input)
        setCallFilterExpBackend(flag)
    }

    const onValidateFilterExpression = (input: boolean) => {
        if (input === true) {
            setFinalData(getDataToSaveUsingPivot(pivotStudyConfig, selectedPivotsSet, [], mode, -1))
        }
        setIsValidated(input)
    }

    const saveButtonClicked = (input: Pivot[]) => {
        axios
            .post("api/Data/SavePivotConfig", input)
            .then((response) => {
                setDataSaved(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const filterExpression = configureFilterClicked ? (
        <div>
            <FilterExpressionDetailedList
                studyPivotConfigs={pivotStudyConfig}
                callBack={onFilterExpUpdate}
                callBackend={callFilterExpBackend}
                validateExpCallBack={onValidateFilterExpression}
            />
        </div>
    ) : (
        ""
    )

    const saveButton = isValidated ? (
        <div>
            <SaveManagePivots
                dataSaved={dataSaved}
                callBack={saveButtonClicked}
                pivots={finalData}
            />
        </div>
    ) : (
        ""
    )

    const pivotDetailedList = sourceSelected ? (
        <div>
            <MyMultiSelectComboBox
                label="Pivots"
                options={allPivots}
                callback={onPivotMultiSelectUpdate}
                placeholder=""
                selectedItems={selectedPivotsPair}
            />
            <PivotsDetailedList data={selectedPivotsSet} callBack={onPivotDetailedlistUpdate} />
            <ConfigureFilterExpressionButton callBack={onConfigureFilterExp} />
            {filterExpression}
            {saveButton}
        </div>
    ) : (
        ""
    )

    return (
        <div>
            {loading ? (
                <Loading message="Getting Data for Modify Pivot Section - hang tight" />
            ) : (
                <div>
                    <MySingleSelectComboBox
                        label="Sources"
                        options={sources}
                        placeholder="Type a source name or select a source from the list"
                        selectedItem={selectedSource}
                        callback={onSourceSelected}
                    />
                    {pivotDetailedList}
                </div>
            )}
        </div>
    )
}
