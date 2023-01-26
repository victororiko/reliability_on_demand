import { IComboBoxOption, IDropdownOption, Text } from "@fluentui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import React from "react"
import { Metric } from "../../models/metric.model"
import { Loading } from "../helpers/Loading"
import { MessageBox } from "../helpers/MessageBox"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"
import { MetricNameDropdown } from "./MetricNameDropdown"

interface Props {
    defaultMetrics: Metric[]
    userMetrics: Metric[]
    StudyConfigID: number
    callbackDeleteMetric: any
    callbackAddMetric: any
}

export const VerticalDropdown = (props: Props) => {
    // force blank for rest of the UI in the beginning
    const [selectedVertical, setSelectedVertical] = React.useState<IDropdownOption | undefined>(undefined)

    const { isError, error, isLoading, data } = useQuery({
        queryKey: ["verticals"],
        queryFn: () => {
            return axios
                .get(`api/Data/GetConfiguredVerticalForAStudy/${props.StudyConfigID}`)
                .then((res) => {
                    return res.data
                })
        },
    })

    if (isError)
        return <MessageBox message={`Failed to get Verticals. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Verticals" />
    if (data.length === 0)
        return (
            <MessageBox message="No Verticals found. Please configure verticals or a study first." />
        )

    const options = data.map((item: any) => {
        return { key: item.VerticalName, text: item.VerticalName }
    })

    const handleVerticalChange = (selection: IComboBoxOption) => {
        setSelectedVertical(selection)
    }

    return (
        <div>
            <Text variant="xLarge">Vertical</Text>
            <MySingleSelectComboBox
                options={options}
                callback={handleVerticalChange}
                label="Vertical"
                placeholder="Select a Vertical"
                selectedItem={selectedVertical}
            />
            {selectedVertical !== undefined ? (
                <MetricNameDropdown
                    defaultMetrics={props.defaultMetrics}
                    userMetrics={props.userMetrics}
                    StudyConfigID={props.StudyConfigID}
                    vertical={selectedVertical.key as string}
                    callbackDeleteMetric={props.callbackDeleteMetric}
                    callbackAddMetric={props.callbackAddMetric}
                />
            ) : (
                ""
            )}
        </div>
    )
}
