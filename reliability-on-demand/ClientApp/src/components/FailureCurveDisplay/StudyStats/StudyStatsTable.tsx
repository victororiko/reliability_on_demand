/* eslint-disable react/no-multi-comp */
import { Typography } from "@mui/material"
import type { MRT_ColumnDef } from "material-react-table" // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import React from "react"
import { StudyInstanceData } from "../../../models/study.model"
import { addSpaces, wrappedHeaderStyle, wrapStyle } from "../../helpers/utils"

interface IStudyStatsTableProps {
    data: StudyInstanceData[]
}

export const StudyStatsTable = (props: IStudyStatsTableProps) => {
    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<StudyInstanceData>[]>(() => {
        return [
            {
                accessorKey: "StudyKey",
                header: addSpaces("StudyKey"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("StudyKey")}</Typography>
                },
                Cell: ({ cell }) => {
                    return <Typography sx={wrapStyle}>{cell.row.original.StudyKey}</Typography>
                },
                minSize: 100, // min size enforced during resizing
                size: 400, // medium column
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
        ]
    }, [])

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                enableColumnOrdering
                enableColumnResizing
                columnResizeMode="onChange"
                enableBottomToolbar={false}
            />
        </div>
    )
}
