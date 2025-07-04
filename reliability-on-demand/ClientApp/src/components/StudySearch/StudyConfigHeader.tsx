import { Stack, Text } from "@fluentui/react"
import React from "react"
import { fixedWidth300px, horizontalStackTokens } from "../helpers/Styles"

interface IStudyConfigHeaderProps {}

export const StudyConfigHeader = (props: IStudyConfigHeaderProps) => {
    return (
        <div>
            <Stack horizontal tokens={horizontalStackTokens}>
                <Text styles={fixedWidth300px} variant="xLarge">
                    Study Name
                </Text>
                <Text styles={fixedWidth300px} variant="xLarge">
                    Created Date
                </Text>
                <Text styles={fixedWidth300px} variant="xLarge">
                    Cache Frequency
                </Text>
                <Text styles={fixedWidth300px} variant="xLarge">
                    Expiry Date
                </Text>
                <Text styles={fixedWidth300px} variant="xLarge">
                    Observation Window
                </Text>
            </Stack>
        </div>
    )
}
