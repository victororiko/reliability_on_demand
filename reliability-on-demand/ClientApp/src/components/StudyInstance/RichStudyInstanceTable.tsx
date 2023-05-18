/* eslint-disable react/no-multi-comp */
/* eslint-disable arrow-body-style */
import { Box, Button, Typography } from "@mui/material"
import type { MRT_ColumnDef } from "material-react-table" // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import queryString from "query-string"
import React from "react"
import { useHistory } from "react-router-dom"
import { StudyInstanceData } from "../../models/study.model"
import { MessageBox } from "../helpers/MessageBox"
import { addSpaces, wrappedHeaderStyle, wrapStyle } from "../helpers/utils"
import { expandCols } from "./service"

interface IRichStudyInstanceTableProps {
    data: StudyInstanceData[]
}

export const RichStudyInstanceTable = (props: IRichStudyInstanceTableProps) => {
    const history = useHistory()
    const navigateToFailureCurve = (StudyKeyInstanceGuidStr: string) => {
        history.push(`/failure-curve/${StudyKeyInstanceGuidStr}`)
    }

    // expand AggregateBy to individual columns
    const moreCols = expandCols(props.data)

    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<StudyInstanceData>[]>(
        () => [
            {
                accessorKey: "StudyKey",
                header: addSpaces("StudyKey"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("StudyKey")}</Typography>
                },
                minSize: 100, // min size enforced during resizing
                size: 400, // medium column
                Cell: ({ cell }) => {
                    return (
                        <Button
                            sx={{ ...wrapStyle, textTransform: "none" }}
                            variant="text"
                            // eslint-disable-next-line max-len
                            onClick={() =>
                                navigateToFailureCurve(cell.row.original.StudyKeyInstanceGuid)
                            }
                        >
                            {cell.row.original.StudyKey}
                        </Button>
                    )
                },
            },
            // StartTime:string,
            {
                accessorKey: "StartTime",
                header: addSpaces("StartTime"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("StartTime")}</Typography>
                },
                filterVariant: "text",
                Cell: ({ cell }) => {
                    // render pretty Date
                    const prettyStartTime = new Date(cell.row.original.StartTime)
                    return (
                        <Typography sx={wrapStyle}>{prettyStartTime.toLocaleString()}</Typography>
                    )
                },
            },
            // EndTime:string,
            {
                accessorKey: "EndTime",
                header: addSpaces("EndTime"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("EndTime")}</Typography>
                },
                filterVariant: "text",
                Cell: ({ cell }) => {
                    // render pretty Date
                    const prettyEndTime = new Date(cell.row.original.EndTime)
                    return <Typography sx={wrapStyle}>{prettyEndTime.toLocaleString()}</Typography>
                },
            },
            // TotalDevices:number,
            {
                accessorKey: "TotalDevices",
                header: addSpaces("TotalDevices"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("TotalDevices")}</Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return <Typography sx={wrapStyle}>{cell.row.original.TotalDevices}</Typography>
                },
                filterVariant: "range",
            },
            // DevicesWithUsage:number,
            {
                accessorKey: "DevicesWithUsage",
                header: addSpaces("DevicesWithUsage"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("DevicesWithUsage")}
                        </Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return (
                        <Typography sx={wrapStyle}>{cell.row.original.DevicesWithUsage}</Typography>
                    )
                },
                filterVariant: "range",
            },
            // UniqueFailureCount:number
            {
                accessorKey: "UniqueFailureCount",
                header: addSpaces("UniqueFailureCount"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("UniqueFailureCount")}
                        </Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return (
                        <Typography sx={wrapStyle}>
                            {cell.row.original.UniqueFailureCount}
                        </Typography>
                    )
                },
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
                initialState={{
                    density: "compact",
                    sorting: [{ id: "TotalDevices", desc: true }],
                    columnVisibility: { StartTime: false, EndTime: false },
                }}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enableStickyHeader
                muiTableContainerProps={{ sx: { maxHeight: "75vh" } }}
                enableColumnResizing
                columnResizeMode="onChange"
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
