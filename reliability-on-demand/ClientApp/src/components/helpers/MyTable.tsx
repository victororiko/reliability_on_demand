import { DetailsList, DetailsListLayoutMode, TextField } from "@fluentui/react"
import React, { FormEvent, useEffect, useState } from "react"

interface IMyTableProps {
    data: any[]
    renderFilter: boolean
}

export const MyTable = (props: IMyTableProps) => {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const onFilter = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        search?: string | undefined
    ): void => {
        if (search === "") setData(props.data)
        if (search) {
            const filteredList = props.data.filter((i) => {
                return JSON.stringify(i).toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
            })
            setData(filteredList)
        }
    }

    const renderFilterConditionally = props.renderFilter && (
        <TextField label="Filter:" onChange={onFilter} />
    )

    const renderDetailsList =
        data.length > 0 ? (
            <DetailsList items={data} layoutMode={DetailsListLayoutMode.justified} />
        ) : (
            "No items to display"
        )

    return (
        <div>
            {renderFilterConditionally}
            {renderDetailsList}
        </div>
    )
}
