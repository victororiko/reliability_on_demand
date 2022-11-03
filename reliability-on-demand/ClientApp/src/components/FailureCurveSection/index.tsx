import axios from "axios"
import * as React from "react"
import { IDropdownOption } from "@fluentui/react"
import { MultiSelectVerticalList } from "./MultiSelectVerticalList"
import { FailureModesSelection } from "./FailureModesSelection"
import { ConfigureVerticalButton } from "./ConfigureVerticalButton"
import { MultiSelectPivots } from "./MultiSelectPivots"
import { PivotsDetailedList } from "./PivotsDetailedList"
import { FilterExpressionDetailedList } from "../helpers/FilterExpression/FilterExpressionDetailedList"
import { ConfigureFilterExpressionButton } from "./ConfigureFilterExpressionButton"
import { AddOrUpdateButton } from "./AddOrUpdateButton"
import { Loading } from "../helpers/Loading"
import { WikiLink } from "../helpers/WikiLink"
import { Vertical } from "../../models/failurecurve.model"
import { Pivot } from "../../models/pivot.model"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import {
    extractModesFromVerticalPair,
    getPivotIDs,
    AddNewSelectedPivots,
    getVerticalNamesFromPair,
    getVerticalNames,
    getMappedPivotWithScopeFilter,
    getDataToSaveUsingPivot,
    getFilterPivots,
    getUniqueMappedPivotWithScopeFilter,
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
    const [selectedPivotsKeys, setSelectedPivotsKeys] = React.useState<string[]>([])
    const [configureFilterExpClicked, setConfigureFilterExpClicked] = React.useState<Boolean>(false)
    const [studyConfigs, setStudyConfigs] = React.useState<StudyPivotConfig[]>([])
    const [selectedMode, setSelectedMode] = React.useState<string>("")
    const [isValidFilterExp, setIsValidFilterExp] = React.useState<boolean>(false)
    const [buttonName, setButtonName] = React.useState<string>("")
    const [dataSaved, setDataSaved] = React.useState<boolean>(false)
    const [callFilterExpBackend, setCallFilterExpBackend] = React.useState<boolean>(true)
    const [dataToSave, setDataToSave] = React.useState<Pivot[]>([])

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
                    setConfiguredVerticals(res.data)
                    setSelectedVerticals(getVerticalNames(res.data))
                })
                .catch((err) => {
                    console.error("Axios Error:", err.message)
                })
        } else setConfiguredVerticals([])
    }, [props.StudyConfigID])

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
        setConfigureFilterExpClicked(false)
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
                if (res.data) {
                    setSelectedPivotsKeys(getPivotIDs(res.data))
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
                if (res.data !== null) {
                    setSelectedPivotsKeys(getPivotIDs(res.data))
                    loadDetailedListRows(res.data)
                    setButtonName("Add Failure Curve")
                }
            })
            .catch((err) => {
                console.error("Axios Error:", err.message)
            })
    }

    const loadFailureVerticalModes = (input: IDropdownOption[], flag: boolean) => {
        setModes(extractModesFromVerticalPair(input))
        setSelectedVerticals(input)
        if (modes.length === 2) {
            let mode = ""
            for (let i = 0; i < modes.length; i++) {
                if (!modes[i].key.toString().match("Select Mode")) {
                    mode = modes[i].key.toString()
                }
            }
            setSelectedMode(mode)
            loadFailureCurvePivots(mode, flag)
        } else {
            setSelectedMode("")
        }
    }

    const loadDetailedListRows = (data: Pivot[]) => {
        setSelectedPivotsSet(getUniqueMappedPivotWithScopeFilter(data, props.StudyConfigID))
        setSelectedPivots(getMappedPivotWithScopeFilter(data, props.StudyConfigID))
    }

    const updateDetailedListRows = (data: string[]) => {
        const temp: Pivot[] = []
        // Adding the rows that from detailed list input that are still selected
        // Also filter the deselected pivots
        for (const ele of selectedPivotsSet) {
            for (const e of data) {
                if (ele.PivotKey === e) {
                    temp.push(ele)
                    break
                }
            }
        }

        // Add new selected checkbox
        const updatedPivotTable = AddNewSelectedPivots(data, pivots, temp)
        setSelectedPivotsKeys(data)
        setSelectedPivotsSet(updatedPivotTable)
        // setSelectedPivotsSet(AddNewPivotDetailedList(selectedPivotsSet, data))
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

    const changeDetailedListInput = (input: Pivot[]) => {
        setSelectedPivotsSet(input)
    }

    const loadFilterExpression = () => {
        setConfigureFilterExpClicked(true)
        setStudyConfigs(getFilterPivots(selectedPivots, selectedPivotsSet, props.StudyConfigID))
        setCallFilterExpBackend(true)
    }

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

    const pivotSection = !modeSelected ? (
        ""
    ) : (
        <div>
            <MultiSelectPivots
                pivots={pivots}
                callBack={updateDetailedListRows}
                selectedOptions={selectedPivotsKeys}
            />
            <PivotsDetailedList data={selectedPivotsSet} callBack={changeDetailedListInput} />
            <ConfigureFilterExpressionButton callBack={loadFilterExpression} />
        </div>
    )

    const updateFilterExpTable = (input: StudyPivotConfig[], flag: boolean) => {
        setStudyConfigs(input)
        setCallFilterExpBackend(flag)
    }

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

    const filterExpressionSection = !configureFilterExpClicked ? (
        ""
    ) : (
        <div>
            <FilterExpressionDetailedList
                studyPivotConfigs={studyConfigs}
                callBack={updateFilterExpTable}
                callBackend={callFilterExpBackend}
                validateExpCallBack={validateFilterExpression}
            />
        </div>
    )

    const finalButton = !isValidFilterExp ? (
        ""
    ) : (
        <AddOrUpdateButton
            ButtonName={buttonName}
            callBack={addOrUpdateStudy}
            dataSaved={dataSaved}
            pivots={dataToSave}
        />
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
                    {filterExpressionSection}
                    {finalButton}
                </div>
            )}
        </div>
    )
}
