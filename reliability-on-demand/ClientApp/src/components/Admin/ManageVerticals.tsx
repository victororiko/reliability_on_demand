import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import * as React from "react"
import { useEffect, useState } from "react"
import { Loading } from "../helpers/Loading"
import { MyMultiSelectComboBox } from "../helpers/MyMultiSelectComboBox"

export interface IManageVerticalsProps {}

export const ManageVerticals = (props: IManageVerticalsProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [verticals, setVerticals] = useState<IComboBoxOption[]>([])
    const [selectedVerticals, setSelectedVerticals] = useState<IComboBoxOption[]>([])

    useEffect(() => {
        setLoading(true)
        axios
            .get(`api/Data/GetAllVerticals`)
            .then((response) => {
                if (response.data) {
                    const arr = response.data
                    const ans = arr.map((item: any) => {
                        const rObj = {
                            key: item.VerticalName.concat("_", item.PivotSourceSubType),
                            text: item.VerticalName,
                        }
                        return rObj
                    })
                    setVerticals(ans) // force combobox to show placeholder text by default
                } else {
                    setVerticals([])
                }
                setLoading(false)
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [])

    const onVerticalsSelected = (input: any) => {
        setSelectedVerticals(input)
    }

    return (
        <div>
            {loading ? (
                <Loading message="Getting Data for Admin Modify Vertical Section - hang tight" />
            ) : (
                <div>
                    <MyMultiSelectComboBox
                        label="Verticals"
                        options={verticals}
                        placeholder="Type a vertical name or select verticals from the list"
                        selectedItems={selectedVerticals}
                        callback={onVerticalsSelected}
                    />
                </div>
            )}
        </div>
    )
}
