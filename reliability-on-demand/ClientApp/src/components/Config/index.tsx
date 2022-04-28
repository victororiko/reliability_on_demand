import { Stack } from '@fluentui/react'
import React, { useState } from 'react'
import { FailureCurve } from '../FailureCurve'
import { containerStackTokens } from '../helpers/Styles'
import { CreateNewID } from '../helpers/utils'
import { Metrics } from '../Metrics'
import { Study } from '../Study'
import Team from '../Team'

type Props = {}

export const Config = (props: Props) => {
  // state
  const [currentTeamId, setCurrentTeamId] = useState(CreateNewID)
  const [currentStudyId, setCurrentStudyId] = useState(CreateNewID)

  // functionality methods
  const selectTeam = (selection: number) => {
    setCurrentTeamId(selection)
    setCurrentStudyId(CreateNewID) // to reset rest of the UI
  }

  const selectStudy = (selection: number) => {
    setCurrentStudyId(selection)
  }

  // render
  return (
    <Stack tokens={containerStackTokens}>
      <Team callBack={selectTeam} />
      {currentTeamId === CreateNewID ? (
        ''
      ) : (
        <div>
          <Study teamid={currentTeamId} callback={selectStudy} />
          {currentStudyId === CreateNewID ? (
            ''
          ) : (
            <div>
              <FailureCurve studyid={currentStudyId} />
              <Metrics studyid={currentStudyId} />
            </div>
          )}
        </div>
      )}
    </Stack>
  )
}
