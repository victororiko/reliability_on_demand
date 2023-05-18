/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-multi-comp */
import { Box, Button, Typography } from "@mui/material"
import queryString from "query-string"
import type { MRT_ColumnDef } from "material-react-table" // If using TypeScript (optional, but recommended)
import MaterialReactTable from "material-react-table"
import React, { useState } from "react"
import * as XLSX from "xlsx"
import { FailureCurveInstance } from "../../../models/failurecurve.model"
import { addSpaces, onlyUnique, wrappedHeaderStyle } from "../../helpers/utils"
import { extractLinks } from "../service"
import { LinkedBugIdRow } from "./LinkedBugIdRow"
import { RichBugState } from "./RichBugState"
import { RichFailureInfo } from "./RichFailureInfo"

interface IRichFailureCurveTableProps {
    data: FailureCurveInstance[]
    updateDeepLinkFn: (deepLink: any) => void
}

export const RichFailureCurveTable = (props: IRichFailureCurveTableProps) => {
    const [filterState] = useState<Array<{ id: string; value: unknown }>>(() => {
        const filters = queryString.parse(location.search, {
            arrayFormat: "none",
        })
        if (filters) {
            const filterArr = Object.keys(filters).map((key) => {
                return { id: key, value: filters[key] }
            })
            return filterArr
        }
        return []
    })

    // column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = React.useMemo<MRT_ColumnDef<FailureCurveInstance>[]>(() => {
        return [
            // StudyKeyInstance:                     string;
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
            // StudyKeyInstanceGuid:                 string;
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
                filterVariant: "range",
                filterFn: "betweenInclusive",
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
                filterVariant: "text",
                filterFn: "fuzzy",
            },
            // RichFailureInfo:                          string;
            {
                accessorKey: "RichFailureInfo",
                header: addSpaces("RichFailureInfo"),
                Header: () => {
                    return (
                        <Typography sx={wrappedHeaderStyle}>
                            {addSpaces("RichFailureInfo")}
                        </Typography>
                    )
                },
                Cell: ({ cell }) => {
                    return <RichFailureInfo item={cell.row.original} />
                },
                size: 900,
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
                    return <RichFailureInfo item={cell.row.original} showFialureName />
                },
                size: 900,
                filterVariant: "text",
                filterFn: "contains",
            },
            // BugTitle:                             string;
            {
                accessorKey: "BugTitle",
                header: addSpaces("BugTitle"),
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>{addSpaces("BugTitle")}</Typography>
                },
                Cell: ({ cell }) => {
                    return <RichFailureInfo item={cell.row.original} showBugTitle />
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
                filterVariant: "range",
                filterFn: "betweenInclusive",
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
                filterVariant: "range",
                filterFn: "betweenInclusive",
            },
            // PctDevices:                           number;
            {
                accessorKey: "PctDevices",
                header: "% of Devices",
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>% of Devices</Typography>
                },
                filterVariant: "range",
                filterFn: "betweenInclusive",
            },
            // PctHits:                              number;
            {
                accessorKey: "PctHits",
                header: "% of Hits",
                Header: () => {
                    return <Typography sx={wrappedHeaderStyle}>% of Hits</Typography>
                },
                filterVariant: "range",
                filterFn: "betweenInclusive",
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

    const onExportToExcel = (failures: FailureCurveInstance[]) => {
        // Add links for failure curve and bug id
        const failuresWithLinks = failures.map((item: FailureCurveInstance) => {
            const { FailureLink, BugLink } = extractLinks(item)
            return {
                ...item,
                FailureLink,
                BugLink,
            }
        })
        const excelData = failuresWithLinks
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData)
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
        }

        // display Windows Save Dialog box with default file name.xslx
        const timestamp = new Date().toLocaleString()
        const fileName = `RichReliabilityFailureCurveData_export_${timestamp}.xlsx`
        XLSX.writeFile(workbook, fileName)
    }

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={props.data}
                initialState={{
                    columnFilters: filterState,
                    sorting: [{ id: "Rank", desc: false }],
                    columnVisibility: {
                        StudyKeyInstance: false,
                        StudyKeyInstanceGuid: false,
                        StudyFailureCurveKeyInstance: false,
                        StudyFailureCurveKeyInstanceGuid: false,
                        Vertical: false,
                        FailureCurveType: false,
                        Rank: true,
                        ModuleName: false,
                        FailureHash: false,
                        BugID: true,
                        ResolvedReason: true,
                        RichFailureInfo: false,
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
                // enableColumnFilterModes
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
                                    // get existing filters
                                    const currFilters = table.getState().columnFilters
                                    props.updateDeepLinkFn(currFilters)
                                }}
                            >
                                DEEPLINK
                            </Button>
                            <Button
                                onClick={() => {
                                    props.updateDeepLinkFn([])
                                    table.resetColumnFilters(true)
                                }}
                            >
                                Reset Filters
                            </Button>
                            <Button
                                onClick={() => {
                                    onExportToExcel(props.data)
                                }}
                            >
                                Export To Excel
                            </Button>
                        </Box>
                    )
                }}
            />
        </div>
    )
}
