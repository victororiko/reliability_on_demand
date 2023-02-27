import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import { Link, Stack, Typography } from "@mui/material"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"
import { extractLinks } from "../service"

interface IRichFailureInfoProps {
    item: FailureCurveInstance
    showFialureName?: boolean
    showBugTitle?: boolean
}

/**
 * Renders a row filled with failure details
    Failure: [Watson Failure]
    Bug: [Bug Title]
    Area Path: [Area Path]
 */
export const RichFailureInfo = (props: IRichFailureInfoProps) => {
    // extract useful pieces from props
    const { FailureName, BugTitle, AreaPath } = props.item
    const { BugLink, FailureLink, HeatmapLink } = extractLinks(props.item)

    const failureNameLinked = (
        <Typography>
            <Link href={FailureLink} target="_blank">
                {FailureName}
            </Link>
        </Typography>
    )
    if (props.showFialureName) return failureNameLinked

    const bugTitleLinked = (
        <Typography>
            <Link href={BugLink} target="_blank">
                {BugTitle}
            </Link>
        </Typography>
    )

    const heatMapLinked = (
        <Typography>
            <Link href={HeatmapLink} target="_blank">
                <LocalFireDepartmentIcon fontSize="small" />
            </Link>
        </Typography>
    )

    if (props.showBugTitle) return bugTitleLinked

    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Failure</Typography>
                {heatMapLinked}
                {failureNameLinked}
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Bug</Typography>
                {bugTitleLinked}
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>AreaPath</Typography>
                <Typography sx={{ fontWeight: "light" }}>{AreaPath}</Typography>
            </Stack>
        </div>
    )
}
