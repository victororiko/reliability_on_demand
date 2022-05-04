/**  Added ? to the computeResourceLocation page as it is optional */

export interface TeamConfig {
  teamID: number
  ownerContact: string
  ownerTeamFriendlyName: string
  ownerTriageAlias: string
  computeResourceLocation?: string
}
