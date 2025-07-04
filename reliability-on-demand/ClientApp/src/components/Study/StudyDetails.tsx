import { IComboBoxOption, Stack, TextField } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Label } from "reactstrap"
import { StudyConfig } from "../../models/study.model"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { horizontalStackTokens } from "../helpers/Styles"
import { CreateNewID } from "../helpers/utils"
import { AddStudyButton } from "./AddStudyButton"
import { DeleteStudyButton } from "./DeleteStudyButton"
import { ExpiryDatePicker } from "./ExpiryDatePicker"
import { FrequencyDropdown } from "./FrequencyDropdown"
import { ObservationWindowDropdown } from "./ObservationWindowDropdown"
import { StudyNameTextField } from "./StudyNameTextField"
import { UpdateStudyButton } from "./UpdateStudyButton"

type Props = {
    callback: any
    teamid: number
    selectedStudy?: StudyConfig
}

export const StudyDetails = (props: Props) => {
    // At first render make sure no user selections exist - hence the explicit undefined
    const [userFrequency, setUserFrequency] = useState<number | undefined>(undefined)
    const [userStudyName, setUserStudyName] = useState<string | undefined>(undefined)
    const [userExpiryDate, setUserExpiryDate] = useState<Date | undefined>(undefined)
    const [userObservationWindow, setUserObservationWindow] = useState<number | undefined>(
        undefined
    )
    const [isNewStudy, setIsNewStudy] = useState<boolean>(!props.selectedStudy)
    const [studyTypes, setStudyTypes] = useState<IComboBoxOption[]>([])
    const [selectedStudyType, setSelectedStudyType] = useState<IComboBoxOption>()

    useEffect(() => {
        // Whenever this component is loaded - flush previous user selections
        setUserFrequency(undefined)
        setUserStudyName(undefined)
        setUserExpiryDate(undefined)
        setUserObservationWindow(undefined)
        // Show add button if 'create new study' option is selected in study combobox
        setIsNewStudy(!props.selectedStudy)

        // Fetching all studytypes from the backend
        axios.get(`api/Data/GetAllStudyTypes`).then((response) => {
            if (response.data) {
                const arr = response.data
                const ans = arr.map((item: any) => {
                    const rObj = {
                        key: item.StudyType,
                        text: item.StudyType,
                    }
                    return rObj
                })
                const defaultEntry: IComboBoxOption = {
                    key: "Select study type",
                    text: "Select study type",
                }
                // Making sure to add the default entry in the starting
                const finalAnsWithDefault = [defaultEntry, ...ans]
                setStudyTypes(finalAnsWithDefault)
            } else {
                setStudyTypes([]) // force combobox to show placeholder text by default
            }
        })

        const selectedOption: IComboBoxOption = {
            key: props.selectedStudy?.StudyType ?? "Select study type",
            text: props.selectedStudy?.StudyType ?? "Select study type",
        }

        setSelectedStudyType(selectedOption)
    }, [props.selectedStudy])

    // helper methods
    const userInputSensed = (): boolean => {
        if (userFrequency !== undefined) return true
        if (userStudyName !== undefined) return true
        if (userExpiryDate !== undefined) return true
        if (userObservationWindow !== undefined) return true
        return false
    }

    const allRequiredFieldsTouched = (): boolean => {
        if (userFrequency === undefined) return false
        if (userStudyName === undefined) return false
        if (userExpiryDate === undefined) return false
        if (userObservationWindow === undefined) return false
        // at this point you are guaranteed that all fields have been touched
        return true
    }

    const addStudyToBackend = () => {
        const newUserCreatedStudy = {
            CacheFrequency: userFrequency,
            StudyName: userStudyName,
            Expiry: userExpiryDate,
            ObservationWindowDays: userObservationWindow,
            // additional properties that to generate a valid study config object
            TeamID: props.teamid,
            LastRefreshDate: new Date(),
            StudyType: selectedStudyType?.key,
        } as StudyConfig
        axios
            .post(`api/Data/AddStudy`, newUserCreatedStudy)
            .then((result) => {
                props.callback("add button clicked")
                return console.debug(result)
            })
            .catch((err) => {
                console.error(err)
                return alert(
                    `${newUserCreatedStudy.StudyName} already exists. Please provide a different value for Study Name`
                )
            })
    }

    // assumption: props.selectedStudy !== undefined
    const updateStudyToBackend = () => {
        if (props.selectedStudy !== undefined) {
            const updatedUserStudy = { ...props.selectedStudy }
            if (userFrequency !== undefined) updatedUserStudy.CacheFrequency = userFrequency
            if (userStudyName !== undefined) updatedUserStudy.StudyName = userStudyName
            if (userExpiryDate !== undefined) updatedUserStudy.Expiry = userExpiryDate
            if (userObservationWindow !== undefined) {
                updatedUserStudy.ObservationWindowDays = userObservationWindow
            }
            if (selectedStudyType !== undefined) {
                updatedUserStudy.StudyType = selectedStudyType.key.toString()
            }
            updatedUserStudy.LastRefreshDate = new Date()
            updatedUserStudy.StudyConfigID = props.selectedStudy.StudyConfigID.toString()
            axios
                .post("api/Data/UpdateStudy", updatedUserStudy)
                .then((res) => {
                    props.callback("update button clicked")
                    return console.debug(res)
                })
                .catch((err) => {
                    return console.error(err)
                })
        } else console.error(`props.selectedStudy is ${props.selectedStudy}`)
    }

    const deleteStudyToBackend = () => {
        // delete study config
        if (props.selectedStudy !== undefined) {
            if (props.selectedStudy.StudyConfigID !== CreateNewID.toString()) {
                const studyToDelete = { ...props.selectedStudy }
                studyToDelete.StudyConfigID = props.selectedStudy.StudyConfigID.toString()
                axios
                    .post("api/Data/DeleteStudy", studyToDelete)
                    .then((res) => {
                        props.callback("delete button clicked") // reset study dropdown
                        return console.debug(res)
                    })
                    .catch((err) => {
                        return console.error(err)
                    })
            }
        }
    }

    const onStudyTypeSelected = (input: any) => {
        setSelectedStudyType(input)
    }

    const deleteButton =
        props.selectedStudy !== undefined ? (
            <DeleteStudyButton callback={deleteStudyToBackend} />
        ) : (
            ""
        )

    const updateButton = isNewStudy ? (
        allRequiredFieldsTouched() ? (
            <AddStudyButton disabled={false} callback={addStudyToBackend} />
        ) : (
            <AddStudyButton disabled callback={undefined} />
        )
    ) : userInputSensed() ? (
        <UpdateStudyButton callback={updateStudyToBackend} />
    ) : (
        ""
    )

    return (
        <div>
            <StudyNameTextField currentStudy={props?.selectedStudy} callBack={setUserStudyName} />
            <FrequencyDropdown currentStudy={props?.selectedStudy} callBack={setUserFrequency} />
            <ExpiryDatePicker currentStudy={props?.selectedStudy} callBack={setUserExpiryDate} />
            <ObservationWindowDropdown
                currentStudy={props?.selectedStudy}
                callBack={setUserObservationWindow}
            />
            <MySingleSelectComboBox
                label="Study Type"
                options={studyTypes}
                placeholder="Type a vertical name or select verticals from the list"
                selectedItem={selectedStudyType}
                callback={onStudyTypeSelected}
            />
            {/* Display read-only textfields */}
            {props.selectedStudy !== undefined ? (
                <div>
                    <TextField
                        label="Failure Join Key Expression Columns"
                        disabled
                        defaultValue={props.selectedStudy?.FailureJoinKeyExpressionCols}
                    />
                    <TextField
                        label="Usage Join Key Expression Columns"
                        disabled
                        defaultValue={props.selectedStudy?.UsageJoinKeyExpressionCols}
                    />
                    <TextField
                        label="Population Join Key Expression Columns"
                        disabled
                        defaultValue={props.selectedStudy?.PopulationJoinKeyExpressionCols}
                    />
                </div>
            ) : (
                ""
            )}
            {/* Display Add, Update and Cancel buttons based on selection from dropdown and touching of fields */}
            <Stack horizontal tokens={horizontalStackTokens}>
                {deleteButton}
                {updateButton}
            </Stack>
        </div>
    )
}
