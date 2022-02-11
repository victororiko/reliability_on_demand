import * as React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Loading } from '../helpers/Loading'
import { OwnerContactAlias } from './OwnerContactAlias'
import { OwnerTeamFriendlyName } from './OwnerTeamFriendlyName'
import { OwnerTriageAlias } from './OwnerTriageAlias'
import { SaveTeamButton } from './SaveTeamButton'
import { TeamComboBox } from './TeamComboBox'
import { ComputeResourceLocation } from './ComputeResourceLocation'
import { DeleteTeamButton } from './DeleteTeamButton'
import { TeamConfig } from '../../models/TeamModel'
import { getTeamFromID } from './helper'
import { CreateNewID } from '../helpers/utils'

export interface IManageTeamProps {}

export const ManageTeam = (props: IManageTeamProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [teamConfigs, setTeamConfigs] = useState<TeamConfig[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamConfig>()
  const [newTeamFriendlyName, setTeamFriendlyName] = useState<string>()
  const [newOwnerContact, setOwnerContact] = useState<string>()
  const [newOwnerTriageAlias, setOwnerTriageAlias] = useState<string>()
    const [newComputeResourceLocation, setComputeResourceLocation] = useState<string>()

  const loadTeams = () => {
    axios.get('api/Data/GetAllTeamConfigs').then((res) => {
      if (res.data) {
        setTeamConfigs(res.data)
      } else {
        setTeamConfigs([])
      }

      setLoading(false)
    })
  }

  // Team Selection
    const selectCurrentTeam = (selection: number) => {
        if (selection !== CreateNewID) {
      const mySelection: TeamConfig | undefined = getTeamFromID(
        selection,
        teamConfigs
      )
        setSelectedTeam(mySelection)
    } else {
            const mySelection: TeamConfig = {
                teamID: CreateNewID,
        ownerTeamFriendlyName: '',
        ownerContact: '',
        ownerTriageAlias: '',
        computeResourceLocation:''
      }
      setSelectedTeam(mySelection)
    }
  }

  // Set new team's name based on user's input
  const getTeamName = (valueFromTextField: string) => {
    setTeamFriendlyName(valueFromTextField)
  }

  // Set new team's owner contact alias
  const getTeamContactAlias = (valueFromTextField: string) => {
    setOwnerContact(valueFromTextField)
  }

  // Set new team's triage alias
    const getTeamTriageAlias = (valueFromTextField: string) => {
    setOwnerTriageAlias(valueFromTextField)
  }

    // Set new team's compute resource location based on user's input
    const getComputeResourceLocation = (valueFromTextField: string) => {
        setComputeResourceLocation(valueFromTextField)
    }

    const deleteTeamFromBackend = () => {
        const teamToAddOrUpdate = {
            ownerTeamFriendlyName: selectedTeamObj?.ownerTeamFriendlyName,
            ownerContact: selectedTeamObj?.ownerContact,
            ownerTriageAlias: selectedTeamObj?.ownerTriageAlias,
            teamID: selectedTeamID,
            computeResourceLocation: selectedTeamObj?.computeResourceLocation
        } as TeamConfig

        alert(
            `New Team to be deleted = \n${JSON.stringify(
                teamToAddOrUpdate,
                null,
                4
            )}`
        )
        axios.post('api/Data/DeleteTeam', teamToAddOrUpdate).then(() => {
            loadTeams()
            selectCurrentTeam(-1)
        })
    }

  const addOrSetTeamToBackend = () => {
    // Deciding if the final value should be the current selected study values or the respective edited value
      const selectedTeamObj = getTeamFromID(
          selectedTeam?.teamID ?? CreateNewID,
      teamConfigs
      )
      const selectedTeamID = selectedTeamObj == null ? CreateNewID : selectedTeamObj.teamID
      const tempTeamName =
          newTeamFriendlyName === undefined && selectedTeamObj?.teamID !== CreateNewID
        ? selectedTeamObj?.ownerTeamFriendlyName
        : newTeamFriendlyName
      const tempOwnerContact =
          newOwnerContact === undefined && selectedTeamObj?.teamID !== CreateNewID
        ? selectedTeamObj?.ownerContact
        : newOwnerContact
      const tempOwnerTriageAlias =
          newOwnerTriageAlias === undefined && selectedTeamObj?.teamID !== CreateNewID
        ? selectedTeamObj?.ownerTriageAlias
            : newOwnerTriageAlias

      const tempComputeResourceLocation =
          newComputeResourceLocation === undefined &&
              selectedTeamObj?.teamID !== CreateNewID
              ? selectedTeamObj?.computeResourceLocation
              : newComputeResourceLocation

    const teamToAddOrUpdate = {
      ownerTeamFriendlyName: tempTeamName,
      ownerContact: tempOwnerContact,
      ownerTriageAlias: tempOwnerTriageAlias,
        teamID: selectedTeamID,
        computeResourceLocation: tempComputeResourceLocation
    } as TeamConfig

    if (
      tempTeamName === null ||
      tempTeamName === undefined ||
      tempTeamName === ''
    )
      alert('please specify a Name for the team you are adding')
    // Owner contact check
    else if (tempOwnerContact === null || tempOwnerContact === undefined)
      alert('please specify owner contact for the team you are adding')
    // Owner Triage Alias check
    else if (
      tempOwnerTriageAlias === null ||
      tempOwnerTriageAlias === undefined
    )
      alert('please specify triage alias for the team you are adding')
    else {
        alert(
            `New Team to be added or updated = \n${JSON.stringify(
                teamToAddOrUpdate,
                null,
                4
            )}`
        )
      axios.post('api/Data/SaveTeam', teamToAddOrUpdate).then(() => {
          loadTeams()
          selectCurrentTeam(selectedTeamID)
      })
    }
  }

  useEffect(() => {
      setLoading(true)
      selectCurrentTeam(-1)
    loadTeams()
  }, [])

    // Deciding the button name - Add or Update Team
    const selectedTeamObj = getTeamFromID(selectedTeam?.teamID ?? CreateNewID, teamConfigs)
    const selectedTeamID = selectedTeamObj == null ? CreateNewID : selectedTeamObj?.teamID
    const buttonName = selectedTeamID !== CreateNewID ? 'Update Team' : 'Add Team'
    const deleteButton = selectedTeamID !== CreateNewID ? (
        <DeleteTeamButton callBack={deleteTeamFromBackend}/>
    ) : ''

  return (
    <div>
      {loading ? (
        <Loading message="Getting Data for Team Section - hang tight" />
      ) : (
        <div>
          <h1>Team Section</h1>
          <TeamComboBox data={teamConfigs} callBack={selectCurrentTeam} />
          <OwnerTeamFriendlyName
            currentTeam={selectedTeam}
            callback={getTeamName}
          />
          <OwnerContactAlias
            currentTeam={selectedTeam}
            callback={getTeamContactAlias}
          />
          <OwnerTriageAlias
            currentTeam={selectedTeam}
            callback={getTeamTriageAlias}
                      />
                      <ComputeResourceLocation
                          currentTeam={selectedTeam}
                          callback={getComputeResourceLocation}
                      />
          <SaveTeamButton
            ButtonName={buttonName}
            callBack={addOrSetTeamToBackend}
                      />
                      {deleteButton}
                     
        </div>
      )}
    </div>
  )
}
