import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { PivotSource } from "../../models/pivot.model"
import { Loading } from "../helpers/Loading"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { convertComplexTypeToOptions, PopulationSourceType } from "../helpers/utils"
import { PivotCombobox } from "./PivotCombobox"

type Props = {
    StudyConfigID: number
    showSaveButton: boolean
    captureStudyPivotConfigs: any // callback that can be used to capture the final list of pivots
}

export const Pivots = (props: Props) => {
    const [pivotSources, setPivotSources] = useState<PivotSource[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPivotSource, setSelectedPivotSource] = useState<IComboBoxOption | undefined>(
        undefined
    )

    useEffect(() => {
        setLoading(true)
        axios
            .get(`api/Data/GetAllSourcesForGivenSourceType/${PopulationSourceType}`)
            .then((response) => {
                if (response.data) setPivotSources(response.data as PivotSource[])
                else setPivotSources([])
                setLoading(false)
                setSelectedPivotSource(undefined) // let the user select a pivot source at each render
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [props.StudyConfigID])

    // callback
    const handlePivotSourceSelection = (selection: IComboBoxOption) => {
        setSelectedPivotSource(selection)
    }

    const handleFinalList = (list: PopulationPivotConfigUI[]) => {
        props.captureStudyPivotConfigs(list)
    }

    return (
        <div>
            {loading ? (
                <Loading message="Getting Population based Pivot Sources for you - hang tight" />
            ) : (
                <MySingleSelectComboBox
                    options={convertComplexTypeToOptions(
                        pivotSources,
                        "PivotSource",
                        "PivotSource"
                    )}
                    callback={handlePivotSourceSelection}
                    label="Pivot Source"
                    placeholder="type a Pivot Source to search OR select from the list"
                    selectedItem={undefined} // this shows placeholder text upon load
                />
            )}
            {selectedPivotSource ? (
                <div>
                    <PivotCombobox
                        {...props}
                        pivotSource={selectedPivotSource.text}
                        StudyConfigID={props.StudyConfigID}
                        finalList={handleFinalList}
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    )
}
