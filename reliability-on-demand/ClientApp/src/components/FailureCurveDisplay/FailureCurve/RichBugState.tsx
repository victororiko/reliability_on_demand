import { Typography } from "@mui/material"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"

interface IRichBugStateProps {
    item: FailureCurveInstance
}
/**
 Custom Display of Metric Info
 5.911%
-----------
[Goal – 2%]
 */
export const RichBugState = (props: IRichBugStateProps) => {
    const bug = props.item
    return (
        <div>
            {bug.BugState === "Active" ? (
                <Typography sx={{ color: "red" }}>{bug.BugState}</Typography>
            ) : bug.BugState === "Resolved" ? (
                <Typography sx={{ color: "#ff9800" }}>{bug.BugState}</Typography>
            ) : bug.BugState === "Closed" ? (
                <Typography sx={{ color: "green" }}>{bug.BugState}</Typography>
            ) : (
                <Typography sx={{ color: "black" }}>{bug.BugState}</Typography>
            )}
        </div>
    )
}
