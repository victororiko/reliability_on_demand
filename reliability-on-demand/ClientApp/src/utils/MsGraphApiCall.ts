import { loginRequest, graphConfig } from "../authConfig"

export const callMsGraph = async (msalInstance: any) => {
    const account = msalInstance.getActiveAccount()
    if (!account) {
        throw Error(
            "No active account! Verify a user has been signed in and setActiveAccount has been called."
        )
    }

    const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
    })

    const headers = new Headers()
    const bearer = `Bearer ${response.accessToken}`

    headers.append("Authorization", bearer)

    const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers,
    }

    return fetch(graphConfig.graphMeEndpoint, options)
        .then((apiresponse) => {
            const res = apiresponse.json()
            return res
        })
        .catch((error) => {
            return console.error(error)
        })
}
