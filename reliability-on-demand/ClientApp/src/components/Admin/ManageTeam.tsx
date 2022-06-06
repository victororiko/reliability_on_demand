import * as React from 'react'
import axios from 'axios'
import { Label } from '@fluentui/react'
import { useEffect, useState } from 'react'
import { Loading } from '../helpers/Loading'
import { OwnerContactAlias } from './OwnerContactAlias'
import { OwnerTeamFriendlyName } from './OwnerTeamFriendlyName'
import { OwnerTriageAlias } from './OwnerTriageAlias'
import { SaveTeamButton } from './SaveTeamButton'
import { TeamComboBox } from './TeamComboBox'
import { ComputeResourceLocation } from './ComputeResourceLocation'
import { DeleteTeamButton } from './DeleteTeamButton'
import { TeamConfig } from '../../models/team.model'
import { getTeamFromID } from './helper'
import { CreateNewID, SaveMessage } from '../helpers/utils'

export interface IManageTeamProps {}

export const ManageTeam = (props: IManageTeamProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [teamConfigs, setTeamConfigs] = useState<TeamConfig[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamConfig>()
  const [newTeamFriendlyName, setTeamFriendlyName] = useState<string>()
  const [newOwnerContact, setOwnerContact] = useState<string>()
  const [newOwnerTriageAlias, setOwnerTriageAlias] = useState<string>()
  const [newComputeResourceLocation, setComputeResourceLocation] =
    useState<string>()
  const [hasSaveClicked, setHasSaveClicked] = useState<boolean>(false)

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
        TeamID: CreateNewID,
        OwnerTeamFriendlyName: '',
        OwnerContact: '',
        OwnerTriageAlias: '',
        ComputeResourceLocation: '',
      }
      setSelectedTeam(mySelection)
    }

    setHasSaveClicked(false)
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
      OwnerTeamFriendlyName: selectedTeamObj?.OwnerTeamFriendlyName,
      OwnerContact: selectedTeamObj?.OwnerContact,
      OwnerTriageAlias: selectedTeamObj?.OwnerTriageAlias,
      TeamID: selectedTeamID,
      ComputeResourceLocation: selectedTeamObj?.ComputeResourceLocation,
    } as TeamConfig

    axios.post('api/Data/DeleteTeam', teamToAddOrUpdate).then(() => {
      loadTeams()
      selectCurrentTeam(-1)
    })
  }

  const addOrSetTeamToBackend = () => {
    // Deciding if the final value should be the current selected study values or the respective edited value
    const selectedTeamObj = getTeamFromID(
      selectedTeam?.TeamID ?? CreateNewID,
      teamConfigs
    )
    const selectedTeamID =
      selectedTeamObj == null ? CreateNewID : selectedTeamObj.TeamID
    const tempTeamName =
      newTeamFriendlyName === undefined &&
      selectedTeamObj?.TeamID !== CreateNewID
        ? selectedTeamObj?.OwnerTeamFriendlyName
        : newTeamFriendlyName
    const tempOwnerContact =
      newOwnerContact === undefined && selectedTeamObj?.TeamID !== CreateNewID
        ? selectedTeamObj?.OwnerContact
        : newOwnerContact
    const tempOwnerTriageAlias =
      newOwnerTriageAlias === undefined &&
      selectedTeamObj?.TeamID !== CreateNewID
        ? selectedTeamObj?.OwnerTriageAlias
        : newOwnerTriageAlias

    const tempComputeResourceLocation =
      newComputeResourceLocation === undefined &&
      selectedTeamObj?.TeamID !== CreateNewID
        ? selectedTeamObj?.ComputeResourceLocation
        : newComputeResourceLocation

    const teamToAddOrUpdate = {
      OwnerTeamFriendlyName: tempTeamName,
      OwnerContact: tempOwnerContact,
      OwnerTriageAlias: tempOwnerTriageAlias,
      TeamID: selectedTeamID,
      ComputeResourceLocation: tempComputeResourceLocation,
    } as TeamConfig

    axios
      .post('api/Data/SaveTeam', teamToAddOrUpdate)
      .then(() => {
        loadTeams()
        selectCurrentTeam(selectedTeamID)
        setHasSaveClicked(true)
      })
      .catch((err) =>
        {return alert(
          `${teamToAddOrUpdate.OwnerTeamFriendlyName} already exists. Please provide a different value for Owner Team Friendly Name`
        )}
      )
  }

  useEffect(() => {
    setLoading(true)
    selectCurrentTeam(-1)
    loadTeams()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Deciding the button name - Add or Update Team
  const selectedTeamObj = getTeamFromID(
    selectedTeam?.TeamID ?? CreateNewID,
    teamConfigs
  )
  const selectedTeamID =
    selectedTeamObj == null ? CreateNewID : selectedTeamObj?.TeamID
  const buttonName = selectedTeamID !== CreateNewID ? 'Update Team' : 'Add Team'
  const deleteButton =
    selectedTeamID !== CreateNewID ? (
      <DeleteTeamButton callBack={deleteTeamFromBackend} />
    ) : (
      ''
    )
  // checking if any one of the required fields is empty, we will disable the save button
  const disableSaveButton =
    newOwnerTriageAlias === '' ||
    newOwnerContact === '' ||
    newTeamFriendlyName === ''

  // Check if Save label needs to be appeared
  const saveLabel = hasSaveClicked === true ? <Label>{SaveMessage}</Label> : ''

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
            ToDisable={disableSaveButton}
            callBack={addOrSetTeamToBackend}
          />
          {deleteButton}
          {saveLabel}
        </div>
      )}
    </div>
  )
}
