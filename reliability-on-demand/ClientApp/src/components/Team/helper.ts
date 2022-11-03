import { TeamConfig } from "../../models/team.model"

export const getTeamFromHashString = (teams: TeamConfig[], hashstring: string) => {
    return teams.find((item) => {
        return item.HashString === hashstring
    })
}
