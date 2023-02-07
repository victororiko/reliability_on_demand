import React from "react"
import { MetricInstance } from "../../../models/metric.model"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { useMetricsQuery } from "../service"
import { RichMetricsTable } from "./RichMetricsTable"

interface IMetricTableProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
}

export const MetricTable = (props: IMetricTableProps) => {
    const { isError, error, isLoading, data } = useMetricsQuery(
        props.StudyKeyInstanceGuidStr,
        props.Vertical === "All"
            ? undefined
            : (originalData: any) => {
                  return originalData.filter((item: any) => {
                      return item.Vertical === props.Vertical
                  })
              }
    )

    if (isError) return <MessageBox message={`Failed to get Metrics. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Metrics" />

    return (
        <div>
            <h5>Metrics</h5>
            <RichMetricsTable data={data as MetricInstance[]} />
        </div>
    )
}
