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
    const { BugLink, FailureLink } = extractLinks(props.item)

    const failureNameLinked = (
        <Typography>
            <Link href={FailureLink}>{FailureName}</Link>
        </Typography>
    )
    if (props.showFialureName) return failureNameLinked

    const bugTitleLinked = (
        <Typography>
            <Link href={BugLink}>{BugTitle}</Link>
        </Typography>
    )
    if (props.showBugTitle) return bugTitleLinked

    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Failure:</Typography>
                {failureNameLinked}
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Bug:</Typography>
                {bugTitleLinked}
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>AreaPath:</Typography>
                <Typography sx={{ fontWeight: "light" }}>{AreaPath}</Typography>
            </Stack>
        </div>
    )
}
