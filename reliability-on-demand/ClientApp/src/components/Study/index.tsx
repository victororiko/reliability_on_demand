import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StudyConfig } from '../../models/study.model'
import { Loading } from '../helpers/Loading'
import { CreateNewID } from '../helpers/utils'
import { StudyComboBox } from './StudyComboBox'

type Props = {
  teamid: number
  callback: any
  queryStringParams: any
}

export const Study = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const [studyConfigs, setStudyConfigs] = useState<StudyConfig[]>([])
  // re-mount component when new team is selected
  useEffect(() => {
    loadStudies(props.teamid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.teamid]) // react-hooks/exhaustive-deps requires us to add loadStudies as a dependency but it's a constant and its value never changes, hence disabling eslint for this line

  // functionality methods
  const loadStudies = (id: number) => {
    setLoading(true)
    axios.get(`api/Data/GetStudies/${props.teamid}`).then((res) => {
      if (res.data) setStudyConfigs(res.data as StudyConfig[])
      else setStudyConfigs([])
      setLoading(false)
    })
  }

  const callbackLoadStudies = (value: string) => {
    console.debug(value)
    loadStudies(props.teamid)
    props.callback(CreateNewID)
  }

  // render
  return (
    <div>
      <h1>Study Section</h1>
      {loading ? (
        <Loading message="Getting Data for Study Section - hang tight" />
      ) : (
        <>
          <StudyComboBox
            teamid={props.teamid}
            data={studyConfigs}
            callBack={callbackLoadStudies}
            callBacksetStudyConfigID={props.callback}
            queryStringParams={props.queryStringParams}
          />
        </>
      )}
    </div>
  )
}
