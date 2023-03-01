import { Stack } from "@fluentui/react"
import React, { useState } from "react"
import { Container } from "reactstrap"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { FailureCurve } from "../FailureCurveSection"
import { containerStackTokens } from "../helpers/Styles"
import { CreateNewID } from "../helpers/utils"
import { Metrics } from "../Metrics"
import { Pivots } from "../Pivots"
import { Study } from "../Study"
import { Team } from "../Team"

export const ConfigPage = (props: any) => {
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

    const handlecaptureStudyPivotConfigs = (studyPivotConfigs: PopulationPivotConfigUI[]) => {}

    // render
    return (
        <Container>
            <Stack tokens={containerStackTokens}>
                <Team callback={selectTeam} showMoreDetails={true} showTitle={true} />
                {currentTeamId === CreateNewID ? (
                    ""
                ) : (
                    <div>
                        <Study teamid={currentTeamId} callback={selectStudy} />
                        {currentStudyConfigID === CreateNewID ? (
                            ""
                        ) : (
                            <div>
                                <Pivots
                                    StudyConfigID={currentStudyConfigID}
                                    showSaveButton={true}
                                    captureStudyPivotConfigs={handlecaptureStudyPivotConfigs}
                                />
                                <FailureCurve StudyConfigID={currentStudyConfigID} />
                                <Metrics StudyConfigID={currentStudyConfigID} />
                            </div>
                        )}
                    </div>
                )}
            </Stack>
        </Container>
    )
}
