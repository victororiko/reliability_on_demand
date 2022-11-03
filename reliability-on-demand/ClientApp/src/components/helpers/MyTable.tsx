import { DetailsList } from "@fluentui/react"
import React from "react"

interface IMyTableProps {
    items: any[]
}

export const MyTable = (props: IMyTableProps) => {
    return (
        <div>
            <DetailsList items={props.items} />
        </div>
    )
}
