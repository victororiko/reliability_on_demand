import React from "react"
import {
    DetailsList,
    TooltipHost,
    SelectionMode,
    IColumn,
    Checkbox,
    IDropdownOption,
} from "@fluentui/react"
import { Pivot } from "../../models/pivot.model"
import { mapPivotTableColumnValue, buildColumnArray } from "./helper"

// Please ignore this for now. I will be changing this file in this task - 41135957
interface Props {
    data: Pivot[]
    callBack: any
}

export const PivotsDetailedList = (props: Props) => {
    const renderItemColumn = (item: IDropdownOption, index?: number, column?: IColumn) => {
        const fieldContent = item[column?.fieldName as keyof IDropdownOption] as string

        if (column?.key === "VerticalName") {
            return <span>{fieldContent}</span>
        }

        return (
            <span>
                <Checkbox
                    checked={Boolean(fieldContent ?? false)}
                    id={`${index}_${column?.key}`}
                    onChange={onCheckboxChange}
                />
            </span>
        )
    }

    const onCheckboxChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        isChecked?: boolean
    ) => {
        const target = ev?.target as HTMLInputElement
        const arr = target.id.toString().split("_")
        const row = Number(arr[0])
        const col = arr[1]

        props.callBack(mapPivotTableColumnValue(props.data, row, col, target.checked))
    }

    return (
        <div>
            <DetailsList
                items={props.data}
                setKey="set"
                columns={buildColumnArray(props.data)}
                onRenderItemColumn={renderItemColumn}
                selectionMode={SelectionMode.none}
            />
        </div>
    )
}
