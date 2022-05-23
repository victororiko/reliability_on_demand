import { TeamConfig } from '../../models/team.model'

export const getTeamFromId = (teams: TeamConfig[], id: number) => {
  return teams.find((item) => {
    return item.TeamID === id
  })
}
