/* eslint-disable arrow-body-style */
import { Box } from "@mui/material"
import type { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import React from "react"
import { StudyInstanceData } from "../../models/study.model"
import { MessageBox } from "../helpers/MessageBox"
import { expandCols } from "./service"

interface IRichStudyInstanceTableProps {
    data: StudyInstanceData[]
}

export const RichStudyInstanceTable = (props: IRichStudyInstanceTableProps) => {
    // expand AggregateBy to individual columns
    const moreCols = expandCols(props.data)

    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<StudyInstanceData>[]>(
        () => [
            {
                accessorKey: "StudyKey",
                header: "Study Key",
                minSize: 100, // min size enforced during resizing
                size: 400, // medium column
            },
            {
                accessorKey: "StartTime",
                header: "Start Time",
                filterVariant: "text",
            },
            {
                accessorKey: "EndTime",
                header: "End Time",
                filterVariant: "text",
            },
            // TotalDevices:number,
            {
                accessorKey: "TotalDevices",
                header: "Total Devices",
                filterVariant: "range",
            },
            // DevicesWithUsage:number,
            {
                accessorKey: "DevicesWithUsage",
                header: "Devices With Usage",
                filterVariant: "range",
            },
            // UniqueFailureCount:number
            {
                accessorKey: "UniqueFailureCount",
                header: "Unique Failure Count",
                filterVariant: "range",
            },
            ...moreCols,
        ],
        []
    )

    return (
        <div>
            <h3>Unique Studies for Config</h3>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                initialState={{ columnVisibility: { StartTime: false, EndTime: false } }}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enableStickyHeader
                muiTableContainerProps={{ sx: { maxHeight: "75vh" } }}
                enableColumnResizing
                columnResizeMode="onEnd"
                renderDetailPanel={({ row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <MessageBox message={row.original} isJSON />
                    </Box>
                )}
            />
        </div>
    )
}
