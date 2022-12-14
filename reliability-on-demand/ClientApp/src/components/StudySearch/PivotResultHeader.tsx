import { Stack, Text } from "@fluentui/react"
import React from "react"
import { fixedWidth300px, horizontalStackTokens } from "../helpers/Styles"

interface IPivotResultHeaderProps {}

export const PivotResultHeader = (props: IPivotResultHeaderProps) => {
    return (
        <div>
            <div>
                <Stack horizontal tokens={horizontalStackTokens}>
                    <Text styles={fixedWidth300px} variant="xLarge">
                        Pivot Name
                    </Text>
                    <Text styles={fixedWidth300px} variant="xLarge">
                        Aggregate By
                    </Text>
                    <Text styles={fixedWidth300px} variant="xLarge">
                        Pivot Scope
                    </Text>
                </Stack>
            </div>
        </div>
    )
}
