import { IComboBoxOption, Label, Stack } from "@fluentui/react"
import axios from "axios"
import * as React from "react"
import { useEffect, useState } from "react"
import { MySingleSelectComboBox } from "../../helpers/MySingleSelectComboBox"
import { Vertical } from "../../../models/failurecurve.model"
import { MyTextField } from "../../helpers/MyTextField"
import { MyToggle } from "../../helpers/MyToggle"
import { MyButton } from "../../helpers/MyButton"
import { SimplifiedButtonType } from "../../helpers/utils"
import { horizontalStackTokens } from "../../helpers/Styles"

export interface IManageFailureVerticalsProps {}

export const ManageFailureVerticals = (props: IManageFailureVerticalsProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [verticals, setVerticals] = useState<Vertical[]>([])
    const [verticalOptions, setVerticalOptions] = useState<IComboBoxOption[]>([])
    const [selectedVertical, setSelectedVertical] = useState<IComboBoxOption>()
    const [selectedVerticalName, setSelectedVerticalName] = useState<string>("")
    const [selectedFailureEventNameList, setSelectedFailureEventNameList] = useState<string>("")
    const [selectedFailureEventGroup, setSelectedFailureEventGroup] = useState<string>("")
    const [selectedParentVerticalName, setSelectedParentVerticalName] = useState<string>("")
    const [selectedFailureSourceName, setSelectedFailureSourceName] = useState<string>("")
    const [selectedAuxiliaryClause, setSelectedAuxiliaryClause] = useState<string>("")
    const [selectedImportantProcessClause, setSelectedImportantProcessClause] = useState<string>("")
    const [selectedScenario1Clause, setSelectedScenario1Clause] = useState<string>("")
    const [selectedPivotSourceSubtype, setSelectedPivotSourceSubtype] = useState<string>("")
    const [selectedIsSubVertical, setSelectedIsSubVertical] = useState<boolean>(false)
    const [selectedFailureFeederIgnored, setSelectedFailureFeederIgnored] = useState<boolean>(false)
    const [buttonLabel, setButtonLabel] = useState<string>("Add vertical")
    const [dataSaved, setDataSaved] = useState<boolean>(false)
    const [hashstring, setHashString] = useState<string>("")
    const [formattedScenarioClase, setFormattedScenarioClause] = useState<string>("")
    const [allowedToSave, setAllowedToSave] = useState<Boolean>(false)

    const loadVerticals = () => {
        axios.get("api/Data/GetVerticals").then((res) => {
            if (res.data) {
                setVerticals(res.data)
                const arr = res.data
                const ans = arr.map((item: any) => {
                    const rObj = {
                        key: item.VerticalName,
                        text: item.VerticalName,
                    }
                    return rObj
                })
                // Making sure to add the default entry in the starting
                const finalAnsWithDefault = ans

                const newEntry: IComboBoxOption = {
                    key: "Add new Vertical",
                    text: "Add new Vertical",
                }

                finalAnsWithDefault.push(newEntry)
                setVerticalOptions(finalAnsWithDefault)

                // Resetting verticals dropdown and, other fields
                setSelectedVertical(newEntry)
                onVerticalSelected(newEntry)
            } else {
                setVerticals([])
                setVerticalOptions([])
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        loadVerticals()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Vertical Selection
    const onVerticalSelected = (selectedOption: IComboBoxOption) => {
        setSelectedVertical(selectedOption)
        if (selectedOption.key === "Add new Vertical") {
            setSelectedVerticalName("Add new Vertical")
            setSelectedFailureEventNameList("")
            setSelectedFailureEventGroup("")
            setSelectedParentVerticalName("")
            setSelectedFailureSourceName("")
            setSelectedAuxiliaryClause("")
            setSelectedImportantProcessClause("")
            setSelectedScenario1Clause("")
            setSelectedPivotSourceSubtype("")
            setSelectedIsSubVertical(false)
            setSelectedFailureFeederIgnored(false)
            setButtonLabel("Add vertical")
            setHashString("")
        } else {
            const selection: Vertical | undefined = verticals.find(
                ({ VerticalName: verticalName }) => {
                    return verticalName === selectedOption.key
                }
            )

            setSelectedVerticalName(selection?.VerticalName ?? "")
            setSelectedFailureEventNameList(selection?.FailureEventNameList ?? "")
            setSelectedFailureEventGroup(selection?.FailureEventGroup ?? "")
            setSelectedParentVerticalName(selection?.ParentVerticalName ?? "")
            setSelectedFailureSourceName(selection?.FailureSourceName ?? "")
            setSelectedAuxiliaryClause(selection?.AuxiliaryClause ?? "")
            setSelectedImportantProcessClause(selection?.ImportantProcessClause ?? "")
            setSelectedScenario1Clause(selection?.Scenario1Clause ?? "")
            setSelectedPivotSourceSubtype(selection?.PivotSourceSubType ?? "")
            setSelectedIsSubVertical(selection?.IsSubVertical ?? false)
            setSelectedFailureFeederIgnored(selection?.FailureFeederIgnored ?? false)
            setButtonLabel("Update vertical")
            setHashString(selection?.HashString ?? "")
        }
    }

    const onVerticalNameSelected = (selection: string) => {
        setSelectedVerticalName(selection)
    }

    const onFailureEventNameListSelected = (selection: string) => {
        setSelectedFailureEventNameList(selection)
    }

    const onFailureEventGroupSelected = (selection: string) => {
        setSelectedFailureEventGroup(selection)
    }

    const onParentVerticalNameSelected = (selection: string) => {
        setSelectedParentVerticalName(selection)
    }

    const onFailureSourceNameSelected = (selection: string) => {
        setSelectedFailureSourceName(selection)
    }

    const onAuxiliaryClauseSelected = (selection: string) => {
        setSelectedAuxiliaryClause(selection)
    }

    const onImportantProcessSelected = (selection: string) => {
        setSelectedImportantProcessClause(selection)
    }

    const onScenario1ClauseSelected = (selection: string) => {
        setSelectedScenario1Clause(selection)
        setAllowedToSave(false)
    }

    const onPivotSourceSubtypeSelected = (selection: string) => {
        setSelectedPivotSourceSubtype(selection)
    }

    const onIsSubVerticalSelected = (selection: boolean) => {
        setSelectedIsSubVertical(selection)
    }

    const onFailureFeederIgnoredSelected = (selection: boolean) => {
        setSelectedFailureFeederIgnored(selection)
    }

    const onSaveVertical = () => {
        const tempDataToSave: Vertical = {
            VerticalID: buttonLabel.includes("Add") ? -1 : 0,
            VerticalName: selectedVerticalName,
            FailureEventNameList: selectedFailureEventNameList,
            FailureEventGroup: selectedFailureEventGroup,
            PivotSourceSubType: selectedPivotSourceSubtype,
            IsSubVertical: selectedIsSubVertical,
            ParentVerticalName: selectedParentVerticalName,
            FailureSourceName: selectedFailureSourceName,
            AuxiliaryClause: selectedAuxiliaryClause,
            ImportantProcessClause: selectedImportantProcessClause,
            Scenario1Clause: selectedScenario1Clause,
            FailureFeederIgnored: selectedFailureFeederIgnored,
            HashString:
                hashstring === ""
                    ? `${selectedVerticalName}_${selectedPivotSourceSubtype}`
                    : hashstring,
        }

        axios
            .post(`api/Data/SaveVertical`, tempDataToSave)
            .then((response) => {
                setDataSaved(true)
                loadVerticals()
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const onFormattedScenarioClause = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            clause: selectedScenario1Clause,
        }

        axios
            .post(`api/Data/FormattedScenarioClause`, requestOptions)
            .then((response) => {
                setFormattedScenarioClause(response.data)
            })
            .catch((err) => {})
    }

    const onUseFormattedScenarioClause = () => {
        setSelectedScenario1Clause(formattedScenarioClase)
        setAllowedToSave(true)
    }

    const onDeleteVertical = () => {
        alert(selectedVerticalName)
        axios
            .get(`api/Data/DeleteVertical/${hashstring}`)
            .then((response) => {
                setDataSaved(true)
                loadVerticals()
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const saveLabel = !dataSaved ? (
        ""
    ) : (
        <div>
            <Label>Data has been saved successfully</Label>
        </div>
    )

    const deleteButton = buttonLabel.includes("Add") ? (
        ""
    ) : (
        <MyButton
            buttonType={SimplifiedButtonType.Primary}
            text="Delete Vertical"
            callback={onDeleteVertical}
        />
    )

    const formatClause = !allowedToSave ? (
        <div>
            <MyButton
                buttonType={SimplifiedButtonType.Primary}
                text="Format Scenario Clause"
                callback={onFormattedScenarioClause}
            />
            <Label>{formattedScenarioClase}</Label>
            <MyButton
                buttonType={SimplifiedButtonType.Primary}
                text="Use Formatted Scenario Clause"
                callback={onUseFormattedScenarioClause}
            />
        </div>
    ) : (
        ""
    )

    const saveOrUpdateButton = !allowedToSave ? (
        ""
    ) : (
        <MyButton
            buttonType={SimplifiedButtonType.Primary}
            text={buttonLabel}
            callback={onSaveVertical}
        />
    )

    return (
        <div>
            <MySingleSelectComboBox
                label="Verticals"
                options={verticalOptions}
                placeholder="Type a vertical name or select verticals from the list"
                selectedItem={selectedVertical}
                callback={onVerticalSelected}
            />
            <MyTextField
                label="Vertical Name"
                placeholder="Vertical Name"
                validateOnLoad={false}
                textFieldValue={selectedVerticalName}
                callback={onVerticalNameSelected}
                isRequired={false}
            />
            <MyTextField
                label="Failure Event Name List"
                placeholder="Failure Event Name List"
                validateOnLoad={false}
                textFieldValue={selectedFailureEventNameList}
                callback={onFailureEventNameListSelected}
                isRequired={false}
            />
            <MyTextField
                label="Failure Event Group"
                placeholder="Failure Event Group"
                validateOnLoad={false}
                textFieldValue={selectedFailureEventGroup}
                callback={onFailureEventGroupSelected}
                isRequired={false}
            />
            <MyTextField
                label="Pivot SourceSubtype"
                placeholder="KernelMode/UserMode"
                validateOnLoad={false}
                textFieldValue={selectedPivotSourceSubtype}
                callback={onPivotSourceSubtypeSelected}
                isRequired={false}
            />
            <MyToggle
                value={selectedIsSubVertical}
                label="Is Subvertical"
                callBack={onIsSubVerticalSelected}
            />
            <MyTextField
                label="Parent Vertical name"
                placeholder="Parent Vertical name"
                validateOnLoad={false}
                textFieldValue={selectedParentVerticalName}
                callback={onParentVerticalNameSelected}
                isRequired={false}
            />
            <MyTextField
                label="Failure Source Name"
                placeholder="Failure Source Name"
                validateOnLoad={false}
                textFieldValue={selectedFailureSourceName}
                callback={onFailureSourceNameSelected}
                isRequired={false}
            />
            <MyTextField
                label="Auxiliary Clause"
                placeholder="Auxiliary Clause"
                validateOnLoad={false}
                textFieldValue={selectedAuxiliaryClause}
                callback={onAuxiliaryClauseSelected}
                isRequired={false}
            />
            <MyTextField
                label="Important Process Clause"
                placeholder="Important Process Clause"
                validateOnLoad={false}
                textFieldValue={selectedImportantProcessClause}
                callback={onImportantProcessSelected}
                isRequired={false}
            />
            <MyTextField
                label="Scenario1 Clause"
                placeholder="Scenario1 Clause"
                validateOnLoad={false}
                textFieldValue={selectedScenario1Clause}
                callback={onScenario1ClauseSelected}
                isRequired={false}
            />
            <MyToggle
                value={selectedFailureFeederIgnored}
                label="Failure Feeder Ignored"
                callBack={onFailureFeederIgnoredSelected}
            />
            {formatClause}
            <Stack horizontal tokens={horizontalStackTokens}>
                {saveOrUpdateButton}
                {deleteButton}
            </Stack>
            {saveLabel}
        </div>
    )
}
