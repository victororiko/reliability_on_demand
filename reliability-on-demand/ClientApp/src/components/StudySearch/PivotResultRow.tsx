import { Stack, Text } from "@fluentui/react"
import React from "react"
import { PopulationPivotConfig } from "../../models/filterexpression.model"
import { fixedWidth300px, horizontalStackTokens } from "../helpers/Styles"

interface IPivotResultRowProps {
    config: PopulationPivotConfig
}

// Responsibility: render Pivot Result
export const PivotResultRow = (props: IPivotResultRowProps) => {
    const pivotName = props.config.PivotName
    const pivotOperator = props.config.PivotOperator
    const pivotScopeValue = props.config.PivotScopeValue
    const pivotScopeStr: string =
        pivotOperator && pivotScopeValue ? `${pivotName} ${pivotOperator} ${pivotScopeValue}` : ""
    return (
        <div>
            <Stack horizontal tokens={horizontalStackTokens}>
                <Text styles={fixedWidth300px}>{pivotName}</Text>
                <Text styles={fixedWidth300px}>{props.config.AggregateBy ? "true" : "false"}</Text>
                <Text styles={fixedWidth300px} data-testid="pivotScopeString">
                    {pivotScopeStr}
                </Text>
            </Stack>
        </div>
    )
}
