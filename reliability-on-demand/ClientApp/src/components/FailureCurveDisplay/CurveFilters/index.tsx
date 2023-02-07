import { Grid } from "@mui/material"
import React from "react"
import { TimeFrameDropdown } from "./TimeFrameDropdown"
import { VerticalDropdown } from "./VerticalDropdown"

interface ICurveFiltersProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
    handleVerticalChangeFn: (newVertical: string) => void
    handleTimeFrameChangeFn: (newGuidStr: string) => void
}

/**
 *
 * Responsibilities:
 * 1. Handle switching time frames
 * 2. Handle switching verticals
 * 3. update data from backend with filters
 * @param props Guid
 * @returns
 */
export const CurveFilters = (props: ICurveFiltersProps) => {
    return (
        <div>
            <h5>Study Filters</h5>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TimeFrameDropdown
                        StudyKeyInstanceGuidStr={props.StudyKeyInstanceGuidStr}
                        changeTimeFrameCallback={props.handleTimeFrameChangeFn}
                    />
                </Grid>
                <Grid item xs={4}>
                    <VerticalDropdown
                        StudyKeyInstanceGuidStr={props.StudyKeyInstanceGuidStr}
                        Vertical={props.Vertical}
                        handleVerticalChangeFn={props.handleVerticalChangeFn}
                    />
                </Grid>
            </Grid>
        </div>
    )
}
