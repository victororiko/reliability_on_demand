/**  Added ? to the computeResourceLocation page as it is optional */

export interface TeamConfig {
    TeamID: number
    OwnerContact: string
    OwnerTeamFriendlyName: string
    OwnerTriageAlias: string
    ComputeResourceLocation?: string
    HashString?: string
}
