import { Link, Typography } from "@mui/material"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"

interface ILinkedBugIdRowProps {
    item: FailureCurveInstance
}

export const LinkedBugIdRow = (props: ILinkedBugIdRowProps) => {
    const bugId = props.item.BugID
    const bug = props.item
    return (
        <div>
            <Link
                href={`https://microsoft.visualstudio.com/DefaultCollection/OS/_workitems/edit/${bugId}`}
            >
                {bug.BugState === "Active" ? (
                    <Typography sx={{ color: "red" }}>{bugId}</Typography>
                ) : bug.BugState === "Resolved" ? (
                    <Typography sx={{ color: "#ff9800" }}>{bugId}</Typography>
                ) : bug.BugState === "Closed" ? (
                    <Typography sx={{ color: "green" }}>{bugId}</Typography>
                ) : (
                    <Typography sx={{ color: "black" }}>{bugId}</Typography>
                )}
            </Link>
        </div>
    )
}
