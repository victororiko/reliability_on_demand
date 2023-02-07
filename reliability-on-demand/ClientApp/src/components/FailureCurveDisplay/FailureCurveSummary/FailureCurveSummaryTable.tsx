import { Typography } from "@mui/material"
import type { MRT_ColumnDef } from "material-react-table" // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import React from "react"
import { FailureCurveSummary } from "../../../models/failurecurve.model"
import { addSpaces, wrappedHeaderStyle, wrapStyle } from "../../helpers/utils"

interface IFailureCurveSummaryTableProps {
    data: FailureCurveSummary[]
}

export const FailureCurveSummaryTable = (props: IFailureCurveSummaryTableProps) => {
    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<FailureCurveSummary>[]>(() => {
        return [
            // StudyKeyInstance: string,
            {
                accessorKey: "StudyKeyInstance",
                header: addSpaces("StudyKeyInstance"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyKeyInstance")}
                        </Typography>
                    )
                },
            },
            // StudyKeyInstanceGuid: string,
            {
                accessorKey: "StudyKeyInstanceGuid",
                header: addSpaces("StudyKeyInstanceGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyKeyInstanceGuid")}
                        </Typography>
                    )
                },
            },
            // Vertical: string,
            {
                accessorKey: "Vertical",
                header: addSpaces("Vertical"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("Vertical")}</Typography>
                },
            },
            // StudyVerticalKey: string,
            {
                accessorKey: "StudyVerticalKey",
                header: addSpaces("StudyVerticalKey"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyVerticalKey")}
                        </Typography>
                    )
                },
            },
            // StudyVerticalKeyGuid: string,
            {
                accessorKey: "StudyVerticalKeyGuid",
                header: addSpaces("StudyVerticalKeyGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyVerticalKeyGuid")}
                        </Typography>
                    )
                },
            },
            // StudyVerticalKeyInstance: string,
            {
                accessorKey: "StudyVerticalKeyInstance",
                header: addSpaces("StudyVerticalKeyInstance"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyVerticalKeyInstance")}
                        </Typography>
                    )
                },
            },
            // StudyVerticalKeyInstanceGuid: string,
            {
                accessorKey: "StudyVerticalKeyInstanceGuid",
                header: addSpaces("StudyVerticalKeyInstanceGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyVerticalKeyInstanceGuid")}
                        </Typography>
                    )
                },
            },
            // TotalHitCount: number,
            {
                accessorKey: "TotalHitCount",
                header: addSpaces("TotalHitCount"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("TotalHitCount")}
                        </Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return (
                        <Typography sx={{ ...wrapStyle, fontSize: 14 }}>
                            {cell.row.original.TotalHitCount.toFixed(2)}
                        </Typography>
                    )
                },
                filterVariant: "range",
            },
            // UniqueFailureCount: number,
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
                filterVariant: "range",
            },
            // TotalFailingDevices: number
            {
                accessorKey: "TotalFailingDevices",
                header: addSpaces("TotalFailingDevices"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("TotalFailingDevices")}
                        </Typography>
                    )
                },
                filterVariant: "range",
            },
        ]
    }, [])

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                enableColumnOrdering
                enableStickyHeader
                enableColumnResizing
                columnResizeMode="onChange"
                initialState={{
                    columnVisibility: {
                        StudyKeyInstance: false,
                        StudyKeyInstanceGuid: false,
                        Vertical: true,
                        StudyVerticalKey: false,
                        StudyVerticalKeyGuid: false,
                        StudyVerticalKeyInstance: false,
                        StudyVerticalKeyInstanceGuid: false,
                        TotalHitCount: true,
                        UniqueFailureCount: true,
                        TotalFailingDevices: true,
                    },
                }}
                enableBottomToolbar={false}
            />
        </div>
    )
}
