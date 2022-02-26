import { TeamConfig } from '../../models/TeamModel'
import { EmptyFieldErrorMessage } from '../helpers/utils'

export const getTeamFromID = (
  selection: number,
  teamConfigs: TeamConfig[]
): TeamConfig | undefined => {
  // extracting TeamID property out of each element and comparing it.
  const parsedStudy = teamConfigs.find(({ teamID }) => {
    return teamID === selection
  })
  return parsedStudy
}

// returns the appropriate value for the control
export const getControlValue = (
  currentTeam: TeamConfig | undefined,
  controlValue: string,
  previousID: number,
  callback: any,
  attr: string | undefined
): string | undefined => {
  // To make the field editable for update as well.
  if (currentTeam?.teamID !== previousID) {
    callback(currentTeam?.ownerTriageAlias)
    return attr
  }
  return controlValue
}

// validates the user input
export const getErrorMessage = (
  controlValue: string,
  callback: any
): string | undefined => {
  // To make the field editable for update as well.
  if (controlValue === '') {
    callback(controlValue)
    return EmptyFieldErrorMessage
  }
  return ''
}
