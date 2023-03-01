import queryString from "query-string"
import React, { useState } from "react"
import { FailureCurveInstance } from "../../../models/failurecurve.model"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { useFailureCurveQuery } from "../service"
import { Deeplink } from "./Deeplink"
import { RichFailureCurveTable } from "./RichFailureCurveTable"

interface IFailureCurveProps {
    StudyKeyInstanceGuidStr: string
    Vertical: string
}

export const FailureCurve = (props: IFailureCurveProps) => {
    const [deeplink, setDeeplink] = useState<string>(window.location.href)
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
        const output = filterArr.reduce((acc: any, { id, value }: any) => {
            acc[id] = Array.isArray(value) ? value : [value]
            return acc
        }, {})
        const filterStr = queryString.stringify(output, { arrayFormat: "comma" })

        // clear out old filters if they exists in the deeplink
        const deeplinkUrl = new URL(deeplink)

        if (filterStr.length > 0) {
            deeplinkUrl.search = `?StudyKeyInstanceGuid=${props.StudyKeyInstanceGuidStr}&${filterStr}`
            setDeeplink(deeplinkUrl.href)
        }
    }

    return (
        <div>
            <h5>Failure Curve</h5>
            <Deeplink content={deeplink} />
            <RichFailureCurveTable
                data={data as FailureCurveInstance[]}
                updateDeepLinkFn={handleDeeplink}
            />
        </div>
    )
}
