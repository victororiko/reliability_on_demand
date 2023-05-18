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

    const handleDeeplink = (tableFilterArr: any) => {
        const exitCondition = !tableFilterArr
        if(exitCondition) return

        // sanitize prev by: setting any undefined values to null
        const sanitized = tableFilterArr.map((item:any) => {
            const sanitizedItem = item
            const currValue = item.value
            if (Array.isArray(currValue)) {
                sanitizedItem.value = currValue.map((val) => {
                    if (val === undefined) return ""
                    return val
                })
            }
            return sanitizedItem
        })

        const filterArr = sanitized.filter((item:any) => {
            const currValue = item.value
            if (Array.isArray(currValue)) {
                for(let i = 0; i < currValue.length; i++) {
                    if(currValue[i] !== "") return true
                }
                return false // at this point all values are empty strings
            }
            return currValue !== ""
        })

        const output = filterArr.reduce((acc: any, { id, value }: any) => {
            acc[id] = Array.isArray(value) ? value : [value]
            return acc
        }, {})

        const filterStr = queryString.stringify(output, {
            arrayFormat: "none",
            skipNull: false,
            skipEmptyString: false,
            sort: false,
            strict: true,
        })

        // clear out old filters if they exists in the deeplink
        const deeplinkUrl = new URL(deeplink)

        deeplinkUrl.search = `${filterStr}`
        setDeeplink(deeplinkUrl.href)
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
