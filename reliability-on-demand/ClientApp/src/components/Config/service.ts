/* eslint-disable max-len */
import { useMsal } from "@azure/msal-react"
import { useQuery } from "@tanstack/react-query"
import { callMsGraph } from "../../utils/MsGraphApiCall"
import { defaultOfSixtyMins } from "../helpers/utils"

export const useCosRelDataMemberVerificationQuery = () => {
    const { instance } = useMsal()

    return useQuery({
        queryKey: ["CosRelDataMemberVerification"],
        queryFn: async () => {
            const data = await callMsGraph(instance)
            return data
        },
        staleTime: defaultOfSixtyMins,
        retry: 1,
    })
}
