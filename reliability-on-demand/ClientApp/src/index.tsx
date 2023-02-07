import "bootstrap/dist/css/bootstrap.css"
import * as React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import {
    PublicClientApplication,
    EventType,
    EventMessage,
    AuthenticationResult,
    Configuration,
} from "@azure/msal-browser"
import { ThemeProvider } from "@fluentui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App } from "./App"
import { msalConfig } from "./authConfig"

export const msalInstance = new PublicClientApplication(msalConfig)

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts()
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
}

msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult
        const { account } = payload
        msalInstance.setActiveAccount(account)
    }
})

const queryClient = new QueryClient()

ReactDOM.render(
    <BrowserRouter>
        {/* <React.StrictMode> */}
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <App pca={msalInstance} />
            </QueryClientProvider>
        </ThemeProvider>
        {/* </React.StrictMode> */}
    </BrowserRouter>,
    document.getElementById("root")
)
