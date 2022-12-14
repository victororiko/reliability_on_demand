import { Stack, Text } from "@fluentui/react"
import React, { useEffect, useState } from "react"
import { StudyConfig } from "../../models/study.model"
import { fixedWidth300px, horizontalStackTokens, lightBlueBox } from "../helpers/Styles"
import { hardCodedFrequencies } from "../helpers/utils"
import { PivotResultList } from "./PivotResultList"
import { getNameAndDate } from "./service"

interface IStudyConfigRowProps {
    config: StudyConfig
}

export const StudyConfigRow = (props: IStudyConfigRowProps) => {
    const [simplifiedConfig, setSimplifiedConfig] = useState(getNameAndDate(props.config))
    useEffect(() => {
        // set new state
        const smallerObj = getNameAndDate(props.config)
        setSimplifiedConfig(smallerObj)
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
                <Text styles={fixedWidth300px}>{props.config.StudyName}</Text>
                <Text styles={fixedWidth300px}>{props.config.LastRefreshDate}</Text>
                <Text styles={fixedWidth300px}>{CacheFrequencyStr}</Text>
                <Text styles={fixedWidth300px}>{props.config.Expiry}</Text>
                <Text styles={fixedWidth300px}>{props.config.ObservationWindowDays}</Text>
            </Stack>
            {showDetails && <PivotResultList config={props.config} />}
        </div>
    )
}
