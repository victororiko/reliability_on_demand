import { Stack } from "@fluentui/react"
import * as QueryString from "query-string"
import React, { useState } from "react"
import { FailureCurve } from "../FailureCurveSection"
import { containerStackTokens } from "../helpers/Styles"
import { CreateNewID } from "../helpers/utils"
import { Metrics } from "../Metrics"
import { Pivots } from "../Pivots"
import { Study } from "../Study"
import { Team } from "../Team"

export const Config = (props: any) => {
    // query string parsing
    const params = QueryString.parse(props.location.search)

    // state
    const [currentTeamId, setCurrentTeamId] = useState(CreateNewID)
    const [currentStudyConfigID, setCurrentStudyConfigID] = useState(CreateNewID)

    // functionality methods
    const selectTeam = (selection: number) => {
        setCurrentTeamId(selection)
        setCurrentStudyConfigID(CreateNewID) // to reset rest of the UI
    }

    const selectStudy = (selection: number) => {
        setCurrentStudyConfigID(selection)
    }

    // render
    return (
        <Stack tokens={containerStackTokens}>
            <Team
                callback={selectTeam}
                queryStringParams={params}
                showMoreDetails={true}
                showTitle={true}
            />
            {currentTeamId === CreateNewID ? (
                ""
            ) : (
                <div>
                    <Study
                        teamid={currentTeamId}
                        callback={selectStudy}
                        queryStringParams={params}
                    />
                    {currentStudyConfigID === CreateNewID ? (
                        ""
                    ) : (
                        <div>
                            <Pivots StudyConfigID={currentStudyConfigID} showSaveButton={true} />
                            <FailureCurve StudyConfigID={currentStudyConfigID} />
                            <Metrics StudyConfigID={currentStudyConfigID} />
                        </div>
                    )}
                </div>
            )}
        </Stack>
    )
}
