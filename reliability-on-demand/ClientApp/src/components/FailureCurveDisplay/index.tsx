/* eslint-disable max-len */
import { Stack } from "@mui/material"
import queryString from "query-string"
import React, { useState } from "react"
import { emptyGuidStr } from "../helpers/utils"
import { CurveFilters } from "./CurveFilters"
import { FailureCurve } from "./FailureCurve"
import { FailureCurveSummary } from "./FailureCurveSummary"
import { MetricTable } from "./Metric Table"
import { StudyStats } from "./StudyStats"

interface IFailureCurveDisplayProps {}

/**
 * Responsibilities:
 * 1. Organize various sections of failure Curve
 * 2. Collapsible sections honoring user preferences around which sections need to be collapsed by default
 * 3. Handle deeplinks
 * @param props
 * @returns Failure Curve page with rich details and filters around metrics, failure curve, bug status etc...
 */
export const FailureCurveDisplay = (props: IFailureCurveDisplayProps) => {
    // deeplink example: http://localhost:3000/failure-curve?StudyKeyInstanceGuid=d61c757a-b893-6a0e-7f11-e66e60e9ff35&Vertical=appcrash
    const [guid, setGuid] = useState<string>(() => {
        // parse StudyKeyInstanceGuid from query string if it exists
        const { StudyKeyInstanceGuid: StudyKeyInstanceGuidFromDeeplink } = queryString.parse(
            location.search
        )
        if (StudyKeyInstanceGuidFromDeeplink) return StudyKeyInstanceGuidFromDeeplink as string
        return emptyGuidStr
    })

    const [vertical, setVertical] = useState<string>(() => {
        // parse Vertical from query string if it exists
        const { Vertical } = queryString.parse(location.search)
        if (Vertical) return Vertical as string
        return "All"
    })

    // handle dropdown selections
    const handleTimeFrameChange = (newGuidStr: string) => {
        setGuid(newGuidStr)
    }

    const handleVerticalChange = (newVertical: string) => {
        setVertical(newVertical)
    }

    return (
        <div>
            <Stack spacing={2}>
                {
                    // mui Collapsible section
                }
                <StudyStats StudyKeyInstanceGuidStr={guid} />
                <CurveFilters
                    StudyKeyInstanceGuidStr={guid}
                    Vertical={vertical}
                    handleVerticalChangeFn={handleVerticalChange}
                    handleTimeFrameChangeFn={handleTimeFrameChange}
                />
                <MetricTable StudyKeyInstanceGuidStr={guid} Vertical={vertical} />
                <FailureCurveSummary StudyKeyInstanceGuidStr={guid} Vertical={vertical} />
                <FailureCurve StudyKeyInstanceGuidStr={guid} Vertical={vertical} />
            </Stack>
        </div>
    )
}
