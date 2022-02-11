import { TeamConfig} from '../../models/TeamModel'

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
