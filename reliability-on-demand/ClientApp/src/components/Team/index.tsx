import { IComboBoxOption } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { TeamConfig } from "../../models/team.model"
import { Loading } from "../helpers/Loading"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { convertComplexTypeToOptions, convertObjectToOption } from "../helpers/utils"
import { getTeamFromHashString } from "./helper"
import { OwnerContactAlias } from "./OwnerContactAlias"
import { OwnerTeamFriendlyName } from "./OwnerTeamFriendlyName"
import { OwnerTriageAlias } from "./OwnerTriageAlias"

type Props = {
    callback: any
    queryStringParams: any
    showMoreDetails: boolean
    showTitle: boolean
}

export const Team = (props: Props) => {
    const [teamConfigs, setTeamConfigs] = useState<TeamConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTeam, setSelectedTeam] = useState<TeamConfig | undefined>()

    // on mount
    useEffect(() => {
        axios
            .get("api/Data/GetAllTeamConfigs")
            .then((response) => {
                if (response.data) {
                    setTeamConfigs(response.data as TeamConfig[])
                } else setTeamConfigs([])

                if (props.queryStringParams) {
                    const foundTeam = response.data.find((item: TeamConfig) => {
                        return (
                            item.OwnerTeamFriendlyName ===
                            props.queryStringParams.OwnerTeamFriendlyName
                        )
                    })
                    if (foundTeam) {
                        setSelectedTeam(foundTeam)
                        props.callback(foundTeam.TeamID)
                    }
                }
                setLoading(false)
            })
            .catch((exception) => {
                return console.error(exception)
            })
    }, [])

    // callbacks

    const handleTeamSelection = (selection: IComboBoxOption) => {
        const selectionHashString = selection.key as string
        const teamFromSelection = getTeamFromHashString(teamConfigs, selectionHashString)
        setSelectedTeam(teamFromSelection)
        props.callback(teamFromSelection?.TeamID)
    }

    return (
        <div>
            {loading ? (
                <Loading message="Getting Teams for you - hang tight" />
            ) : (
                <>
                    {props.showTitle ? <h1>Team Section</h1> : ""}
                    <MySingleSelectComboBox
                        options={convertComplexTypeToOptions(
                            teamConfigs,
                            "HashString",
                            "OwnerTeamFriendlyName"
                        )}
                        callback={handleTeamSelection}
                        label="Team"
                        placeholder="Type a team name or select a team from the list"
                        selectedItem={
                            selectedTeam === undefined
                                ? undefined
                                : convertObjectToOption(
                                      selectedTeam,
                                      "HashString",
                                      "OwnerTeamFriendlyName"
                                  )
                        }
                    />
                    {selectedTeam && props.showMoreDetails ? (
                        <div>
                            <OwnerContactAlias currentTeam={selectedTeam} />
                            <OwnerTeamFriendlyName currentTeam={selectedTeam} />
                            <OwnerTriageAlias currentTeam={selectedTeam} />
                        </div>
                    ) : (
                        ""
                    )}
                </>
            )}
        </div>
    )
}
