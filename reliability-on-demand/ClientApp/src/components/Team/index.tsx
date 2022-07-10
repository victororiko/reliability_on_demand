import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TeamConfig } from '../../models/team.model'
import { Loading } from '../helpers/Loading'
import { CreateNewID } from '../helpers/utils'
import { getTeamFromId } from './helper'
import OwnerContactAlias from './OwnerContactAlias'
import OwnerTeamFriendlyNameAlias from './OwnerTeamFriendlyName'
import OwnerTriageAlias from './OwnerTriageAlias'
import { TeamComboBox } from './TeamComboBox'

type Props = {
  callback: any
}

export const Team = (props: Props) => {
  const [teamConfigs, setTeamConfigs] = useState<TeamConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTeamId, setCurrentTeamId] = useState(CreateNewID)
  const [selectedTeam, setSelectedTeam] = useState<TeamConfig | undefined>()

  // on mount
  useEffect(() => {
    axios
      .get('api/Data/GetAllTeamConfigs')
      .then((response) => {
        if (response.data) setTeamConfigs(response.data as TeamConfig[])
        else setTeamConfigs([])
        setLoading(false)
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }, [])

  // callbacks
  const handleCallback = (value: number) => {
    setCurrentTeamId(value)
    setSelectedTeam(getTeamFromId(teamConfigs, value))
    props.callback(value)
  }

  const dummyCallback = (value: any) => {
    return console.debug(`value - ${value}`)
  }

  return (
    <div>
      {loading ? (
        <Loading message="Getting Teams for you - hang tight" />
      ) : (
        <>
          <h1>Team Section</h1>
          <TeamComboBox data={teamConfigs} callBack={handleCallback} />
          {currentTeamId === CreateNewID ? (
            ''
          ) : (
            <div>
              <OwnerContactAlias
                currentTeam={selectedTeam}
                callback_function={dummyCallback}
              />
              <OwnerTeamFriendlyNameAlias
                currentTeam={selectedTeam}
                callback_function={dummyCallback}
              />
              <OwnerTriageAlias
                currentTeam={selectedTeam}
                callback_function={dummyCallback}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
