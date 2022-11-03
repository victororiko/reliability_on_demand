import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Metric } from "../../models/metric.model"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import {
    convertItemToOption,
    convertUsageColumnToOptions,
    updateSelectedItemFromProps,
    UsageColumn,
} from "./service"

interface IUsageColumnSingleSelectDropdownProps {
    metricData: Metric
    callback: any
}

export const UsageColumnSingleSelectDropdown = (props: IUsageColumnSingleSelectDropdownProps) => {
    // backing data structure for usage columns combobox
    const [usageColumns, setUsageColumns] = useState<UsageColumn[]>([])
    useEffect(() => {
        axios.get("api/Data/GetUsageColumns").then((res) => {
            if (res.data) {
                setUsageColumns(res.data as UsageColumn[])
            } else {
                console.error("did not receive any usage columns from backend")
            }
        })
    }, [props])

    // backing data strucuture for selected item
    const [selectedItem, setSelectedItem] = useState<IComboBoxOption | undefined>(
        updateSelectedItemFromProps(props.metricData, usageColumns)
    )
    useEffect(() => {
        const usageColOption = updateSelectedItemFromProps(props.metricData, usageColumns)
        setSelectedItem(usageColOption)
    }, [props.metricData])

    // callbacks
    const pushUpSelection = (selection: IComboBoxOption) => {
        console.log(selection)
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
                    selectedItem={selectedItem}
                />
            )}
        </div>
    )
}
