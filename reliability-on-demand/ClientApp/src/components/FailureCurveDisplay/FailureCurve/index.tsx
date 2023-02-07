import queryString from "query-string"
import React from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { useFailureCurveQuery } from "../service"
import { RichFailureCurveTable } from "./RichFailureCurveTable"

interface IFailureCurveProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
}

export const FailureCurve = (props: IFailureCurveProps) => {
    const { isError, error, isLoading, data } = useFailureCurveQuery(
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
                message={`Failed to get Failure Curve Instances. Internal error = ${error}`}
            />
        )
    if (isLoading) return <Loading message="Hang tight - getting Failure Curve Instances" />

    const handleDeeplink = (filterArr: any) => {
        let encodedDeepLink = ""
        for (let index = 0; index < filterArr.length; index++) {
            const item = filterArr[index]
            encodedDeepLink += queryString.stringify(item)
            if (index < filterArr.length - 1) {
                encodedDeepLink += "&"
            }
        }
        console.debug(`Deep link = ${window.location.href}&${encodedDeepLink}`)
    }

    return (
        <div>
            <h5>Failure Curve</h5>
            <RichFailureCurveTable
                data={data as FailureCurveInstance[]}
                updateDeepLinkFn={handleDeeplink}
            />
        </div>
    )
}
