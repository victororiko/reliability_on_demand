import { Typography } from "@mui/material"
import React from "react"
import { MetricInstance } from "../../../models/metric.model"

interface IMetricInfoProps {
    item: MetricInstance
}
/**
 Custom Display of Metric Info
 5.911%
-----------
[Goal – 2%]
 */
export const MetricInfo = (props: IMetricInfoProps) => {
    const metric = props.item
    return (
        <div>
            {
                // Typography element with red color if props.item.MetricEvaluationResult 0 - red 1 - yellow (#ff9800) 2 - green
                metric.MetricEvaluationResult === 0 ? (
                    <Typography sx={{ color: "red" }}>{metric.MetricDisplayValue}</Typography>
                ) : metric.MetricEvaluationResult === 1 ? (
                    <Typography sx={{ color: "#ff9800" }}>{metric.MetricDisplayValue}</Typography>
                ) : metric.MetricEvaluationResult === 2 ? (
                    <Typography sx={{ color: "green" }}>{metric.MetricDisplayValue}</Typography>
                ) : (
                    <Typography sx={{ color: "black" }}>{metric.MetricDisplayValue}</Typography>
                )
            }
        </div>
    )
}
