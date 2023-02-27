import { Link, Stack, Typography } from "@mui/material"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"

interface IRichFailureNameRowProps {
    item: FailureCurveInstance
}

/**
    Failure: [Watson Failure]
    Bug: [Bug Title]
    Area Path: [Area Path]
 */
export const RichFailureNameRow = (props: IRichFailureNameRowProps) => {
    // extract useful pieces from props
    const { FailureHash, FailureName, BugID, BugTitle, AreaPath, FailureMode } = props.item
    // if Vertical in ("oscrash", "livekerneldump", "abs_lpbh")
    const KernelPart = FailureMode === "KernelMode" ? "Kernel" : ""

    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Failure:</Typography>
                <Typography>
                    <Link
                        href={`https://watsonportal.microsoft.com/${KernelPart}Failure?FailureSearchText=${FailureHash}&DateRange=Last%2030%20Days&DateTimeFormat=UTC&MaxRows=100&DisplayMetric=CabCount`}
                        target="_blank"
                    >
                        {FailureName}
                    </Link>
                </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>Bug:</Typography>
                <Typography>
                    <Link
                        href={`https://microsoft.visualstudio.com/DefaultCollection/OS/_workitems/edit/${BugID}`}
                        target="_blank"
                    >
                        {BugTitle}
                    </Link>
                </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>AreaPath:</Typography>
                <Typography sx={{ fontWeight: "light" }}>{AreaPath}</Typography>
            </Stack>
        </div>
    )
}
