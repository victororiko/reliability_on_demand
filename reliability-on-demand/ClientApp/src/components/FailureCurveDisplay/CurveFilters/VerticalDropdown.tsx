/* eslint-disable max-len */
import { IComboBoxOption } from "@fluentui/react"
import React from "react"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { MySingleSelectComboBox } from "../../helpers/MySingleSelectComboBox"
import { onlyUnique } from "../../helpers/utils"
import { useFailureCurveQuery } from "../service"

interface IVerticalDropdownProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
    handleVerticalChangeFn: (newVertical: string) => void
}

export const VerticalDropdown = (props: IVerticalDropdownProps) => {
    const { isError, error, isLoading, data } = useFailureCurveQuery(
        props.StudyKeyInstanceGuidStr,
        undefined
    )

    if (isError)
        return <MessageBox message={`Failed to get Verticals. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Verticals" />

    // get unique verticals from data
    const uniqueVerticals = onlyUnique(
        data.map((item: any) => {
            return item.Vertical
        })
    )

    // start with selecting All verticals if one is not provided
    const allVerticalsOption = { key: "All", text: "All" }

    // generate dropdown from raw data
    const options = uniqueVerticals.map((vertical: string) => {
        return {
            key: vertical,
            text: vertical,
        }
    })
    options.push(allVerticalsOption) // Add a catch all option

    // callback
    const handleVerticalChange = (newVertical: IComboBoxOption) => {
        props.handleVerticalChangeFn(newVertical.text)
    }

    return (
        <div>
            <MySingleSelectComboBox
                options={options}
                callback={handleVerticalChange}
                label="Vertical"
                placeholder="No records to display"
                selectedItem={
                    props.Vertical === "All"
                        ? allVerticalsOption
                        : options.find((item: any) => {
                              return item.key === props.Vertical
                          })
                }
            />
        </div>
    )
}
