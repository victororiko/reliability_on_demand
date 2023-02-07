/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-multi-comp */
import { Box, Button, Typography } from "@mui/material"
import type { MRT_ColumnDef } from "material-react-table" // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"
import { addSpaces, onlyUnique, wrappedHeaderStyle } from "../../helpers/utils"
import { RichFailureNameRow } from "./FailureAndBugRow"
import { LinkedBugIdRow } from "./LinkedBugIdRow"
import { RichBugState } from "./RichBugState"

interface IRichFailureCurveTableProps {
    data: FailureCurveInstance[]
    updateDeepLinkFn: (deepLink: any) => void
}

export const RichFailureCurveTable = (props: IRichFailureCurveTableProps) => {
    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<FailureCurveInstance>[]>(() => {
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
            },
            // StudyFailureCurveKeyInstance:     string;
            {
                accessorKey: "StudyFailureCurveKeyInstance",
                header: addSpaces("StudyFailureCurveKeyInstance"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyFailureCurveKeyInstance")}
                        </Typography>
                    )
                },
            },
            // StudyFailureCurveKeyInstanceGuid: string;
            {
                accessorKey: "StudyFailureCurveKeyInstanceGuid",
                header: addSpaces("StudyFailureCurveKeyInstanceGuid"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("StudyFailureCurveKeyInstanceGuid")}
                        </Typography>
                    )
                },
            },
            // Vertical:                             string;
            {
                accessorKey: "Vertical",
                header: addSpaces("Vertical"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("Vertical")}</Typography>
                },
                filterVariant: "select",
                filterSelectOptions: onlyUnique(
                    props.data.map((item) => {
                        return item.Vertical
                    })
                ),
            },
            // FailureCurveType:                     string;
            {
                accessorKey: "FailureCurveType",
                header: addSpaces("FailureCurveType"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("FailureCurveType")}
                        </Typography>
                    )
                },
            },
            // Rank:                                 number;
            {
                accessorKey: "Rank",
                header: addSpaces("Rank"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("Rank")}</Typography>
                },
                size: 130,
            },
            // ModuleName:                           string;
            {
                accessorKey: "ModuleName",
                header: addSpaces("ModuleName"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("ModuleName")}</Typography>
                    )
                },
                filterVariant: "select",
                filterSelectOptions: onlyUnique(
                    props.data.map((item) => {
                        return item.ModuleName
                    })
                ),
            },
            // FailureHash:                          string;
            {
                accessorKey: "FailureHash",
                header: addSpaces("FailureHash"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("FailureHash")}</Typography>
                    )
                },
            },
            // BugID:                                string;
            {
                accessorKey: "BugID",
                header: addSpaces("BugID"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("BugID")}</Typography>
                },
                Cell: ({ cell }) => {
                    return <LinkedBugIdRow item={cell.row.original} />
                },
                size: 120,
            },
            // ResolvedReason: string
            {
                accessorKey: "ResolvedReason",
                header: addSpaces("ResolvedReason"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("ResolvedReason")}
                        </Typography>
                    )
                },
            },
            // FailureName:                          string;
            {
                accessorKey: "FailureName",
                header: addSpaces("FailureName"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("FailureName")}</Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return <RichFailureNameRow item={cell.row.original} />
                },
                size: 900,
            },
            // BugTitle:                             string;
            {
                accessorKey: "BugTitle",
                header: addSpaces("BugTitle"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("BugTitle")}</Typography>
                },
            },
            // BugState:                             string;
            {
                accessorKey: "BugState",
                header: addSpaces("BugState"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("BugState")}</Typography>
                },
                filterVariant: "select",
                filterSelectOptions: onlyUnique(
                    props.data.map((item) => {
                        return item.BugState
                    })
                ),
                Cell: ({ cell }) => {
                    return <RichBugState item={cell.row.original} />
                },
            },
            // ComponentCategory:                    string;
            {
                accessorKey: "ComponentCategory",
                header: addSpaces("ComponentCategory"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("ComponentCategory")}
                        </Typography>
                    )
                },
                filterVariant: "select",
                filterSelectOptions: onlyUnique(
                    props.data.map((item) => {
                        return item.ComponentCategory
                    })
                ),
            },
            // OrgMapping:                           string;
            {
                accessorKey: "OrgMapping",
                header: addSpaces("OrgMapping"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("OrgMapping")}</Typography>
                    )
                },
                filterVariant: "select",
                filterSelectOptions: onlyUnique(
                    props.data.map((item) => {
                        return item.OrgMapping
                    })
                ),
            },
            // AreaPath:                             string;
            {
                accessorKey: "AreaPath",
                header: addSpaces("AreaPath"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("AreaPath")}</Typography>
                },
            },
            // HitCount:                             number;
            {
                accessorKey: "HitCount",
                header: addSpaces("HitCount"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("HitCount")}</Typography>
                },
            },
            // FailingDevices:                       number;
            {
                accessorKey: "FailingDevices",
                header: addSpaces("FailingDevices"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("FailingDevices")}
                        </Typography>
                    )
                },
            },
            // PctDevices:                           number;
            {
                accessorKey: "PctDevices",
                header: "% of Devices",
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>% of Devices</Typography>
                },
            },
            // PctHits:                              number;
            {
                accessorKey: "PctHits",
                header: "% of Hits",
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>% of Hits</Typography>
                },
            },
            // FailureMode: string
            {
                accessorKey: "FailureMode",
                header: addSpaces("FailureMode"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>{addSpaces("FailureMode")}</Typography>
                    )
                },
            },
        ]
    }, [])

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                initialState={{
                    sorting: [{ id: "Rank", desc: false }],
                    columnVisibility: {
                        StudyInstanceKey: false,
                        StudyInstanceKeyGuid: false,
                        StudyFailureCurveKeyInstance: false,
                        StudyFailureCurveKeyInstanceGuid: false,
                        Vertical: false,
                        FailureCurveType: false,
                        Rank: true,
                        ModuleName: false,
                        FailureHash: false,
                        BugID: true,
                        ResolvedReason: true,
                        FailureName: true,
                        BugTitle: false,
                        BugState: false,
                        ComponentCategory: false,
                        OrgMapping: false,
                        AreaPath: false,
                        HitCount: true,
                        FailingDevices: true,
                        PctDevices: true,
                        PctHits: true,
                        FailureMode: false,
                    },
                    showColumnFilters: false,
                    density: "compact",
                }}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enableStickyHeader
                muiTableContainerProps={{ sx: { maxHeight: "75vh" } }}
                enableColumnResizing
                columnResizeMode="onChange"
                // defaultColumn={{
                //     maxSize: 9000,
                //     minSize: 80,
                //     size: 150, // default size is usually 180
                //   }}
                renderTopToolbarCustomActions={({ table }) => {
                    return (
                        <Box>
                            <Button
                                onClick={() => {
                                    return table.setColumnFilters((prev) => {
                                        props.updateDeepLinkFn(prev)
                                        return [...prev]
                                    })
                                }}
                            >
                                DEEPLINK
                            </Button>
                            <Button
                                onClick={() => {
                                    return table.resetColumnFilters()
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Box>
                    )
                }}
            />
        </div>
    )
}
