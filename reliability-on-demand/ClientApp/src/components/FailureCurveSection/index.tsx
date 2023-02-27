import { IComboBoxOption, IDropdownOption, Label } from "@fluentui/react"
import axios from "axios"
import * as React from "react"
import { Vertical } from "../../models/failurecurve.model"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import { Pivot } from "../../models/pivot.model"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import { Loading } from "../helpers/Loading"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { setCorrectUIInputType } from "../helpers/utils"
import { WikiLink } from "../helpers/WikiLink"
import { AddOrUpdateButton } from "./AddOrUpdateButton"
import { ConfigureVerticalButton } from "./ConfigureVerticalButton"
import { FailureModesSelection } from "./FailureModesSelection"
import { MultiSelectVerticalList } from "./MultiSelectVerticalList"
import { PivotsDetailedList } from "./PivotsDetailedList"
import {
    AddNewSelectedPivots,
    extractModesFromVerticalPair,
    getDataToSaveUsingPivot,
    getFilterPivots,
    getMappedPivotWithScopeFilter,
    getPivotNames,
    getUniqueMappedPivotWithScopeFilter,
    getVerticalNames,
} from "./service"

export interface Props {
    StudyConfigID: number
}

export const FailureCurve = (props: Props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [verticals, setVerticals] = React.useState<Vertical[]>([])
    const [configuredverticals, setConfiguredVerticals] = React.useState<Vertical[]>([])
    const [selectedverticals, setSelectedVerticals] = React.useState<IDropdownOption[]>([])
    const [modeSelectionVisible, setModeSelectionVisible] = React.useState<Boolean>(false)
    const [modes, setModes] = React.useState<IDropdownOption[]>([])
    const [pivots, setPivots] = React.useState<Pivot[]>([])
    const [selectedPivots, setSelectedPivots] = React.useState<Pivot[]>([])
    const [selectedPivotsSet, setSelectedPivotsSet] = React.useState<Pivot[]>([])
    const [modeSelected, setModeSelected] = React.useState<Boolean>(false)
    const [selectedPivotsKeys, setSelectedPivotsKeys] = React.useState<IComboBoxOption[]>([])
    const [studyConfigs, setStudyConfigs] = React.useState<StudyPivotConfig[]>([])
    const [selectedMode, setSelectedMode] = React.useState<string>("")
    const [isValidFilterExp, setIsValidFilterExp] = React.useState<boolean>(false)
    const [buttonName, setButtonName] = React.useState<string>("")
    const [dataSaved, setDataSaved] = React.useState<boolean>(false)
    const [callFilterExpBackend, setCallFilterExpBackend] = React.useState<boolean>(true)
    const [dataToSave, setDataToSave] = React.useState<Pivot[]>([])
    const [emptyScopedPivots, setEmptyScopedPivots] = React.useState<boolean>(false)

    const loadVerticals = () => {
        axios.get("api/Data/GetAllVerticals").then((res) => {
            if (res.data) {
                setVerticals(res.data)
            } else {
                setVerticals([])
            }
            setLoading(false)
        })
    }

    const loadConfiguredVerticals = React.useCallback(() => {
        if (props.StudyConfigID > 0) {
            axios
                .get(`api/Data/GetConfiguredVerticalForAStudy/${props.StudyConfigID}`)
                .then((res) => {
                    if (res.data) {
                        setConfiguredVerticals(res.data)
                        setSelectedVerticals(getVerticalNames(res.data))
                    } else {
                        getDefaultVerticals()
                    }
                })
                .catch((err) => {
                    console.error("Axios Error:", err.message)
                })
        } else setConfiguredVerticals([])
    }, [props.StudyConfigID])

    const getDefaultVerticals = () => {
        axios
            .get(`api/Data/GetDefaultVerticalForAStudy/${props.StudyConfigID}`)
            .then((res) => {
                setConfiguredVerticals(res.data)
                setSelectedVerticals(getVerticalNames(res.data))
            })
            .catch((err) => {
                console.error("Axios Error:", err.message)
            })
    }

    const selectedVerticals = (selection: IDropdownOption[]) => {
        setSelectedVerticals(selection)
        loadFailureVerticalModes(selection, false)
    }

    const configurePivotsForSelectedVerticals = () => {
        loadFailureVerticalModes(selectedverticals, true)
        setModeSelectionVisible(true)
    }

    const hideConfigurationForSelectedVerticals = () => {
        setModeSelectionVisible(false)
        setModeSelected(false)
        setIsValidFilterExp(false)
    }

    const loadFailureCurvePivots = (sourcesubtype: string, flag: boolean) => {
        setPivots([])
        setSelectedMode(sourcesubtype)
        axios
            .get(`api/Data/GetAllFailurePivotNamesForAVertical/${sourcesubtype}`)
            .then((res) => {
                setPivots(res.data)
                setModeSelected(flag)
                loadSelectedPivots(sourcesubtype)
            })
            .catch((err) => {
                console.error("Axios Error:", err.message)
            })
    }

    const loadSelectedPivots = (sourcesubtype: string) => {
        axios
            .get(
                `api/Data/GetAllConfiguredFailurePivotsForAVertical/sourcesubtype/${sourcesubtype}/StudyConfigID/${props.StudyConfigID}`
            )
            .then((res) => {
                const pivotRes = res.data as Pivot[]
                if (pivotRes && pivotRes.length > 0) {
                    setSelectedPivotsKeys(getPivotNames(res.data))
                    loadDetailedListRows(res.data)
                    setButtonName("Update Failure Curve")
                } else {
                    getDefaultPivots(sourcesubtype)
                }
            })
            .catch((err) => {
                console.error("Axios Error:", err.message)
            })
    }

    const getDefaultPivots = (sourcesubtype: string) => {
        axios
            .post("api/Data/GetAllDefaultFailurePivotsForAVertical", sourcesubtype, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                const pivotRes = res.data as Pivot[]
                if (pivotRes && pivotRes.length > 0) {
                    setSelectedPivotsKeys(getPivotNames(res.data))
                    loadDetailedListRows(res.data)
                    setButtonName("Add Failure Curve")
                }
            })
            .catch((err) => {
                console.error("Axios Error:", err.message)
            })
    }

    const loadFailureVerticalModes = (input: IDropdownOption[], flag: boolean) => {
        // storing the result in tempModes to use it for further mode selection logic
        const tempModes = extractModesFromVerticalPair(input) // fix-es-lint error: changed to const becuase tempModes is not being reassigned
        setModes(tempModes)
        setSelectedVerticals(input)
        if (tempModes.length === 2) {
            let mode = ""
            for (let i = 0; i < tempModes.length; i++) {
                if (!tempModes[i].key.toString().match("Select Mode")) {
                    mode = tempModes[i].key.toString()
                }
            }
            setSelectedMode(mode)
            loadFailureCurvePivots(mode, flag)
        } else {
            setSelectedMode("")
        }
    }

    const loadDetailedListRows = (data: Pivot[]) => {
        const tempSelectedPivots = getMappedPivotWithScopeFilter(data, props.StudyConfigID)
        setSelectedPivots(tempSelectedPivots)
        const tempSelectedPivotsSet = getUniqueMappedPivotWithScopeFilter(
            tempSelectedPivots,
            props.StudyConfigID
        )
        setSelectedPivotsSet(tempSelectedPivotsSet)
        const tempStudyConfigs = getFilterPivots(
            tempSelectedPivots,
            tempSelectedPivotsSet,
            props.StudyConfigID
        )
        getFilterExpressionData(tempStudyConfigs, tempSelectedPivotsSet)
    }

    const updateDetailedListRows = (data: IComboBoxOption[]) => {
        const temp: Pivot[] = []
        // Adding the rows that from detailed list input that are still selected
        // Also filter the deselected pivots
        for (const ele of selectedPivotsSet) {
            for (const e of data) {
                if (ele.PivotKey === e.key) {
                    temp.push(ele)
                    break
                }
            }
        }
        // Add new selected checkbox
        const updatedPivotTable = AddNewSelectedPivots(data, pivots, temp)
        setSelectedPivotsKeys(data)
        setSelectedPivotsSet(updatedPivotTable)

        // Making sure to update the Filter expression component whenever Pivots multiselect is updated
        changeDetailedListInput(updatedPivotTable)
    }

    React.useEffect(() => {
        setLoading(true)
        loadConfiguredVerticals()
        loadVerticals()
    }, [loadConfiguredVerticals])

    const modeSelection = !modeSelectionVisible ? (
        ""
    ) : (
        <div>
            <FailureModesSelection
                modes={modes}
                select={selectedMode}
                callBack={loadFailureCurvePivots}
            />
        </div>
    )

    const changeDetailedListInput = (selectedPivotsSetParam: Pivot[]) => {
        const tempStudyConfigs = getFilterPivots(
            selectedPivots,
            selectedPivotsSetParam,
            props.StudyConfigID
        )
        getFilterExpressionData(tempStudyConfigs, selectedPivotsSetParam)
    }

    const getFilterExpressionData = (
        tempStudyConfigs: StudyPivotConfig[],
        selectedPivotsSetParam: Pivot[]
    ) => {
        // if none of the pivots are selected as Filter pivots, display warning and the save button
        if (tempStudyConfigs === null || tempStudyConfigs.length === 0) {
            setDataToSave(
                getDataToSaveUsingPivot(
                    tempStudyConfigs,
                    selectedPivotsSetParam,
                    selectedverticals,
                    selectedMode,
                    props.StudyConfigID
                )
            )
            setEmptyScopedPivots(true)
            setCallFilterExpBackend(false)
        } else {
            // show Filter expression component for the pivots selected for filtering
            setStudyConfigs(tempStudyConfigs)
            setCallFilterExpBackend(true)
            setEmptyScopedPivots(false)
        }
    }

    const withoutFilterSaveWarning = emptyScopedPivots ? (
        <Label className="Label">
            **Warning for Large Datasets: Please filter the data where possible. Unfiltered data can
            result in excessive data explosion. Please verify if unfiltered data is your desired
            outcome. **
        </Label>
    ) : (
        ""
    )

    const validateFilterExpression = (input: StudyPivotConfig[], isValidated: boolean) => {
        if (isValidated === true)
            setDataToSave(
                getDataToSaveUsingPivot(
                    input,
                    selectedPivotsSet,
                    selectedverticals,
                    selectedMode,
                    props.StudyConfigID
                )
            )

        setIsValidFilterExp(isValidated)
    }

    const updateFilterExpTable = (input: StudyPivotConfig[], flag: boolean) => {
        // set correct UIInputType for PivotScopeID - 1 that is newly added Pivot
        setStudyConfigs(setCorrectUIInputType(input, selectedPivotsSet))
        setCallFilterExpBackend(flag)
    }

    const pivotSection = !modeSelected ? (
        ""
    ) : (
        <div>
            <MyMultiSelectComboBox
                label="Select Pivots"
                placeholder="Select Pivots"
                callback={updateDetailedListRows}
                options={getPivotNames(pivots)}
                selectedItems={selectedPivotsKeys}
            />
            <PivotsDetailedList
                data={selectedPivotsSet}
                callBack={changeDetailedListInput}
                key={JSON.stringify(selectedPivotsSet)}
            />
        </div>
    )

    const filterExpSection =
        !emptyScopedPivots && modeSelected ? (
            <div>
                <FilterExpressionDetailedList
                    studyPivotConfigs={studyConfigs}
                    callBack={updateFilterExpTable}
                    callBackend={callFilterExpBackend}
                    validateExpCallBack={validateFilterExpression}
                />
            </div>
        ) : (
            ""
        )

    const addOrUpdateStudy = (pivotConfigs: Pivot[]) => {
        axios
            .post("api/Data/SavedFailureConfig", pivotConfigs)
            .then((response) => {
                setDataSaved(true)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const finalButton =
        isValidFilterExp || emptyScopedPivots ? (
            <AddOrUpdateButton
                ButtonName={buttonName}
                callBack={addOrUpdateStudy}
                dataSaved={dataSaved}
                pivots={dataToSave}
            />
        ) : (
            ""
        )

    return (
        <div>
            {loading ? (
                <Loading message="Getting Data for Failure Section - hang tight" />
            ) : (
                <div>
                    <h1>Failure Curve Section</h1>
                    <WikiLink
                        title="Wiki for this page"
                        url="https://www.osgwiki.com/wiki/RIOD_-_Failure_Curve_Section"
                    />
                    <MultiSelectVerticalList
                        data={verticals}
                        configuredverticals={configuredverticals}
                        callBack={selectedVerticals}
                    />
                    <ConfigureVerticalButton
                        changepivotcallBack={configurePivotsForSelectedVerticals}
                        hidecallBack={hideConfigurationForSelectedVerticals}
                    />
                    {modeSelection}
                    {pivotSection}
                    {filterExpSection}
                    {withoutFilterSaveWarning}
                    {finalButton}
                </div>
            )}
        </div>
    )
}
