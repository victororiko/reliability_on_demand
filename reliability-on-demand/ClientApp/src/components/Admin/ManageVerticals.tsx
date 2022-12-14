import { IComboBoxOption, Stack, Text } from "@fluentui/react"
import axios from "axios"
import * as React from "react"
import { useEffect, useState } from "react"
import { Loading } from "../helpers/Loading"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { fixedWidth300px } from "../helpers/Styles"
import { SaveManageVerticalsButton } from "./SaveManageVerticalsButton"
import { StudyTypeConfig } from "../../models/study.model"

export interface IManageVerticalsProps {}

export const ManageVerticals = (props: IManageVerticalsProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [verticals, setVerticals] = useState<IComboBoxOption[]>([])
    const [studyTypes, setStudyTypes] = useState<IComboBoxOption[]>([])
    const [selectedVerticals, setSelectedVerticals] = useState<IComboBoxOption[]>([])
    const [selectedStudyType, setSelectedStudyType] = useState<IComboBoxOption>()
    const [studySelected, setStudySelected] = useState<Boolean>(false)
    const [dataSaved, setDataSaved] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
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
                ans.push(defaultEntry)
                setStudyTypes(ans)
            } else {
                setStudyTypes([]) // force combobox to show placeholder text by default
            }
            setLoading(false)
        })

        axios
            .get(`api/Data/GetAllVerticals`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    const ans = arr.map((item: any) => {
                        const rObj = {
                            // storing pivot sourcesubtype in the key to use it if required to save a backend call of fetching the sourcesubtype of the selected verticals
                            key: item.VerticalName.concat("_", item.PivotSourceSubType),
                            text: item.VerticalName,
                        }
                        return rObj
                    })
                    setVerticals(ans)
                } else {
                    setVerticals([]) // force combobox to show placeholder text by default
                }
                setLoading(false)
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [])

    const onVerticalsSelected = (input: any) => {
        setSelectedVerticals(input)
        setDataSaved(false)
    }

    const onStudyTypeSelected = (input: any) => {
        setSelectedStudyType(input)
        getAllSelectedVerticalsForAStudy(input)
        setStudySelected(true)
    }

    const getAllSelectedVerticalsForAStudy = (selectedtype: IComboBoxOption) => {
        axios
            .get(`api/Data/GetVerticalsForAStudyType/${selectedtype.key}`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    const ans = arr.map((item: any) => {
                        const rObj = {
                            // storing pivot sourcesubtype in the key to use it if required to save a backend call of fetching the sourcesubtype of the selected verticals
                            key: item.VerticalName.concat("_", item.PivotSourceSubType),
                            text: item.VerticalName,
                        }
                        return rObj
                    })
                    setSelectedVerticals(ans)
                } else {
                    setSelectedVerticals([]) // force combobox to show placeholder text by default
                }
                setLoading(false)
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const selectedVerticalsText = selectedVerticals.map((ele) => {
        return (
            <div>
                <Text styles={fixedWidth300px}>{ele.text}</Text>
            </div>
        )
    })

    const saveButtonClicked = (dataToBeSaved: StudyTypeConfig) => {
        axios
            .post(`api/Data/GetVerticalsForAStudyType`, dataToBeSaved)
            .then((response) => {
                setDataSaved(true)
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }

    const loadOtherComponents =
        studySelected === false ? (
            ""
        ) : (
            <div>
                <MyMultiSelectComboBox
                    label="Verticals"
                    options={verticals}
                    placeholder="Type a vertical name or select verticals from the list"
                    selectedItems={selectedVerticals}
                    callback={onVerticalsSelected}
                />
                {selectedVerticalsText}
                <SaveManageVerticalsButton
                    hasSaved={dataSaved}
                    StudyType={selectedStudyType?.key.toString() ?? ""}
                    SelectedVerticals={selectedVerticals}
                    callBack={saveButtonClicked}
                />
            </div>
        )

    return (
        <div>
            {loading ? (
                <Loading message="Getting Data for Admin Modify Vertical Section - hang tight" />
            ) : (
                <div>
                    <MySingleSelectComboBox
                        label="Verticals"
                        options={studyTypes}
                        placeholder="Type a vertical name or select verticals from the list"
                        selectedItem={selectedStudyType}
                        callback={onStudyTypeSelected}
                    />
                    {loadOtherComponents}
                </div>
            )}
        </div>
    )
}
