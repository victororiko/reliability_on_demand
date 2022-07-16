import { Stack } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import * as QueryString from 'query-string'
import { containerStackTokens } from '../helpers/Styles'
import { CreateNewID } from '../helpers/utils'
import { Metrics } from '../Metrics'
import { Study } from '../Study'
import { Team } from '../Team'
import { FailureCurve } from '../FailureCurveSection'
import { Pivots } from '../Pivots'

export const Config = (props: any) => {
  // query string parsing
  const params = QueryString.parse(props.location.search)

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
      <Team callback={selectTeam} queryStringParams={params} />
      {currentTeamId === CreateNewID ? (
        ''
      ) : (
        <div>
          <Study teamid={currentTeamId} callback={selectStudy} />
          {currentStudyId === CreateNewID ? (
            ''
          ) : (
            <div>
              <Pivots studyid={currentStudyId} />
              <FailureCurve studyid={currentStudyId} />
              <Metrics studyid={currentStudyId} />
            </div>
          )}
        </div>
      )}
    </Stack>
  )
}
