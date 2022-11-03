import { Stack, Text } from "@fluentui/react"
import React from "react"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import { fixedWidth300px, horizontalStackTokens } from "../helpers/Styles"

interface IPivotResultRowProps {
    config: StudyPivotConfig
}

// Responsibility: render Pivot Result
export const PivotResultRow = (props: IPivotResultRowProps) => {
    return (
        <div>
            <Stack horizontal tokens={horizontalStackTokens}>
                <Text styles={fixedWidth300px}>{props.config.PivotName}</Text>
                <Text styles={fixedWidth300px}>{props.config.PivotOperator}</Text>
                <Text styles={fixedWidth300px}>{props.config.PivotScopeValue}</Text>
            </Stack>
        </div>
    )
}
