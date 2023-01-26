import { IComboBoxOption } from "@fluentui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import React from "react"
import { Metric } from "../../models/metric.model"
import { Loading } from "../helpers/Loading"
import { MessageBox } from "../helpers/MessageBox"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { convertUsageColumnToOptions, updateSelectedItemFromProps, UsageColumn } from "./service"

interface IUsageColumnSingleSelectDropdownProps {
    metricData: Metric
    callback: any
}

export const UsageColumnSingleSelectDropdown = (props: IUsageColumnSingleSelectDropdownProps) => {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: ["usageColumns"],
        queryFn: () => {
            return axios.get(`api/Data/GetUsageColumns`).then((res) => {
                return res.data
            })
        },
    })

    if (isError)
        return <MessageBox message={`Failed to get Usage Columns. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Usage Columns" />

    // backing data strucuture for selected item
    const usageColumns = data as UsageColumn[]

    // callbacks
    const pushUpSelection = (selection: IComboBoxOption) => {
        props.callback(selection.key)
    }

    // render()
    return (
        <div>
            {usageColumns.length > 0 && (
                <MySingleSelectComboBox
                    options={convertUsageColumnToOptions(usageColumns)}
                    callback={pushUpSelection}
                    label="Usage Column"
                    placeholder="Please select one Usage Column"
                    selectedItem={updateSelectedItemFromProps(props.metricData, usageColumns)}
                />
            )}
        </div>
    )
}
