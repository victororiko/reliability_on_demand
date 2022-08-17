import { PrimaryButton } from "@fluentui/react"
import axios from "axios"
import React, { useState } from "react"
import { Metric } from "../../models/metric.model"

type Props = {
    userMetric: Metric | {}
    isUserMetric: boolean
    callbackDeleteMetric: any
}

export const DeleteMetricConfigButton = (props: Props) => {
    const [metricDeleted, setMetricDeleted] = useState<boolean>(false)

    const handleClick = () => {
        if (props.isUserMetric) {
            axios
                .post("api/Data/DeleteMetricConfig", props.userMetric)
                .then((response) => {
                    setMetricDeleted(true)
                })
                .catch((error) => {
                    console.error(`failed to add metric with error = ${error}`)
                })
            props.callbackDeleteMetric()
        }
    }

    return (
        <div>
            {metricDeleted ? (
                "Deleted Metric"
            ) : (
                <PrimaryButton text="Delete" onClick={handleClick} disabled={!props.isUserMetric} />
            )}
        </div>
    )
}
