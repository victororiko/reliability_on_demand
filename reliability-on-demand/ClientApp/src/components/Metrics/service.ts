import { IComboBoxOption } from "@fluentui/react"
import { Metric } from "../../models/metric.model"
import { getPivotName } from "../Pivots/service"

export interface UsageColumn {
    Source: string
    UsagePivotKey: string
}

// convert single item to comboboxoption
export const convertItemToOption = (
    inputObj: UsageColumn | undefined
): IComboBoxOption | undefined => {
    if (inputObj === undefined) return undefined
    const arr = convertUsageColumnToOptions([inputObj])
    return arr[0]
}

// convert input array to comboboxoption
export const convertUsageColumnToOptions = (inputData: UsageColumn[]): IComboBoxOption[] => {
    let parsedList: IComboBoxOption[] = []
    if (inputData) {
        parsedList = inputData.map((item: UsageColumn) => {
            const rObj = {
                key: item.UsagePivotKey,
                text: getPivotName(item.UsagePivotKey),
            }
            return rObj
        })
    }
    return parsedList
}

// if user metric is passed in  -> parse it's pivot key, otherwise set to undefined
export const updateSelectedItemFromProps = (
    inputUserMetric: Metric,
    usageColumns: UsageColumn[]
): IComboBoxOption | undefined => {
    const defaultItem: IComboBoxOption = {
        key: "AggregatedAppUsageMetricsHourly.ss_InteractivityDurationMS",
        text: "InteractivityDurationMS",
    }
    if (inputUserMetric) {
        // find user metric from columns array
        const found = usageColumns.find((item) => {
            return item.UsagePivotKey === inputUserMetric.PivotKey
        })
        // set selected item
        if (found) {
            const foundOption = convertItemToOption(found)
            return foundOption
        }
    }
    return defaultItem
}
