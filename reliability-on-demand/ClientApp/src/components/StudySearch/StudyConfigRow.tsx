import { Link, Stack, Text } from "@fluentui/react"
import queryString from "query-string"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { StudyConfig } from "../../models/study.model"
import { fixedWidth300px, horizontalStackTokens, lightBlueBox } from "../helpers/Styles"
import { hardCodedFrequencies } from "../helpers/utils"
import { PivotResultList } from "./PivotResultList"

interface IStudyConfigRowProps {
    config: StudyConfig
}

export const StudyConfigRow = (props: IStudyConfigRowProps) => {
    const history = useHistory()

    const navigateToStudyInstance = () => {
        const params = queryString.stringify({ StudyConfigID: props.config.StudyConfigID })
        history.push(`/study-instance?${params}`)
    }

    useEffect(() => {
        // set new state
    }, [props.config])

    const [showDetails, setShowDetails] = useState<boolean>(false)

    const toggleMoreDetailsFlag = () => {
        const oldShowDetails = showDetails
        setShowDetails(!oldShowDetails)
    }

    const CacheFrequencyStr = hardCodedFrequencies.find((item) => {
        return item.key === props.config.CacheFrequency
    })?.text

    return (
        <div>
            <Stack
                styles={lightBlueBox}
                onClick={toggleMoreDetailsFlag}
                horizontal
                tokens={horizontalStackTokens}
            >
                <Text styles={fixedWidth300px}>
                    <Link onClick={navigateToStudyInstance}>{props.config.StudyName}</Link>
                </Text>
                <Text styles={fixedWidth300px}>{props.config.LastRefreshDate}</Text>
                <Text styles={fixedWidth300px}>{CacheFrequencyStr ?? ""}</Text>
                <Text styles={fixedWidth300px}>{props.config.Expiry}</Text>
                <Text styles={fixedWidth300px}>{props.config.ObservationWindowDays}</Text>
            </Stack>
            {showDetails && <PivotResultList config={props.config} />}
        </div>
    )
}
