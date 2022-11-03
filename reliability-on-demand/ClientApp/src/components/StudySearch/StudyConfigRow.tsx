import { Stack, Text } from "@fluentui/react"
import React, { useEffect, useState } from "react"
import { StudyConfig } from "../../models/study.model"
import { fixedWidth300px, horizontalStackTokens, lightBlueBox } from "../helpers/Styles"
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

    return (
        <div>
            <Stack
                styles={lightBlueBox}
                onClick={toggleMoreDetailsFlag}
                horizontal
                tokens={horizontalStackTokens}
            >
                <Text styles={fixedWidth300px}>{simplifiedConfig["Study Name"]}</Text>
                <Text styles={fixedWidth300px}>{simplifiedConfig["Created Date"]}</Text>
            </Stack>
            {showDetails && <PivotResultList config={props.config} />}
        </div>
    )
}
