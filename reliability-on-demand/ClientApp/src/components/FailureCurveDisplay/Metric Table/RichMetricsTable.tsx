/* eslint-disable react/no-multi-comp */
import { Typography } from "@mui/material"
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import React from "react"
import { MetricInstance } from "../../../models/metric.model"
import { addSpaces, wrappedHeaderStyle } from "../../helpers/utils"
import { MetricInfo } from "./MetricInfo"

interface IRichMetricsTableProps {
    data: MetricInstance[]
}

export const RichMetricsTable = (props: IRichMetricsTableProps) => {
    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<MetricInstance>[]>(() => {
        return [
            // StudyInstanceKey:                     string;
            {
                accessorKey: "StudyInstanceKey",
                header: addSpaces("StudyInstanceKey"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyInstanceKey")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // StudyInstanceKeyGuid:                 string;
            {
                accessorKey: "StudyInstanceKeyGuid",
                header: addSpaces("StudyInstanceKeyGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyInstanceKeyGuid")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // StudyMetricKeyInstance:     string;
            {
                accessorKey: "StudyMetricKeyInstance",
                header: addSpaces("StudyMetricKeyInstance"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyMetricKeyInstance")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // StudyMetricKeyInstanceGuid: string;
            {
                accessorKey: "StudyMetricKeyInstanceGuid",
                header: addSpaces("StudyMetricKeyInstanceGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyMetricKeyInstanceGuid")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricName:                           string;
            {
                accessorKey: "MetricName",
                header: addSpaces("MetricName"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("MetricName")}</Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricDisplayName:                    string;
            {
                accessorKey: "MetricDisplayName",
                header: addSpaces("MetricDisplayName"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("MetricDisplayName")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricDescription:                    string;
            {
                accessorKey: "MetricDescription",
                header: addSpaces("MetricDescription"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("MetricDescription")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricValue:                          number;
            {
                accessorKey: "MetricValue",
                header: addSpaces("MetricValue"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("MetricValue")}</Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return <MetricInfo item={cell.row.original} />
                },
            },
            // MetricDisplayValue:                   string;
            {
                accessorKey: "MetricDisplayValue",
                header: addSpaces("MetricDisplayValue"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("MetricDisplayValue")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricGoal:                           number;
            {
                accessorKey: "MetricGoal",
                header: addSpaces("MetricGoal"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("MetricGoal")}</Typography>
                    )
                },
                filterVariant: "range",
            },
            // MetricGoalDisplayValue:string
            {
                accessorKey: "MetricGoalDisplayValue",
                header: addSpaces("MetricGoalDisplayValue"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("MetricGoalDisplayValue")}
                        </Typography>
                    )
                },
                filterVariant: "text",
            },
            // MetricEvaluationResult: number
            {
                accessorKey: "MetricEvaluationResult",
                header: addSpaces("MetricEvaluationResult"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("MetricEvaluationResult")}
                        </Typography>
                    )
                },
                filterVariant: "range",
            },
            // MetricImpact:                         number;
            {
                accessorKey: "MetricImpact",
                header: addSpaces("MetricImpact"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("MetricImpact")}</Typography>
                    )
                },
                filterVariant: "range",
            },
            // MetricDiff:                           number;
            {
                accessorKey: "MetricDiff",
                header: addSpaces("MetricDiff"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("MetricDiff")}</Typography>
                    )
                },
                filterVariant: "range",
            },
            // Vertical:                           string;
            {
                accessorKey: "Vertical",
                header: addSpaces("Vertical"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("Vertical")}</Typography>
                },
                filterVariant: "text",
            },
        ]
    }, [])

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                initialState={{
                    columnVisibility: {
                        StudyInstanceKey: false,
                        StudyInstanceKeyGuid: false,
                        StudyMetricKeyInstance: false,
                        StudyMetricKeyInstanceGuid: false,
                        MetricName: false,
                        MetricDisplayName: true,
                        MetricDescription: false,
                        MetricValue: true,
                        MetricDisplayValue: false,
                        MetricGoal: false,
                        MetricGoalDisplayValue: true,
                        MetricEvaluationResult: false,
                        MetricImpact: false,
                        MetricDiff: false,
                        Vertical: true,
                    },
                }}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enableStickyHeader
                // muiTableContainerProps={{ sx: { maxHeight: "75vh" } }}
                enableColumnResizing
                columnResizeMode="onChange"
                enableBottomToolbar={false}
            />
        </div>
    )
}
