/* eslint-disable max-len */
import React from "react"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { useFailureCurveSummaryQuery } from "../service"
import { FailureCurveSummaryTable } from "./FailureCurveSummaryTable"

interface IFailureCurveSummaryProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
}

export const FailureCurveSummary = (props: IFailureCurveSummaryProps) => {
    const { isError, error, isLoading, data } = useFailureCurveSummaryQuery(
        props.StudyKeyInstanceGuidStr,
        props.Vertical === "All"
            ? undefined
            : (originalData: any) => {
                  return originalData.filter((item: any) => {
                      return item.Vertical === props.Vertical
                  })
              }
    )

    if (isError)
        return (
            <MessageBox
                message={`Failed to get Failure Curve Summary. Internal error = ${error}`}
            />
        )
    if (isLoading) return <Loading message="Hang tight - getting Failure Curve Summary" />

    return (
        <div>
            <h5>Failure Curve Summary</h5>
            <FailureCurveSummaryTable data={data} />
        </div>
    )
}
