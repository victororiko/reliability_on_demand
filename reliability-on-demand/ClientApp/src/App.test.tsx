import * as React from "react"
import * as ReactDOM from "react-dom"
import { MemoryRouter } from "react-router-dom"
import {
    PublicClientApplication,
    EventType,
    EventMessage,
    AuthenticationResult,
    Configuration,
} from "@azure/msal-browser"
import { App } from "./App"
import { msalConfig } from "./authConfig"

export const msalInstance = new PublicClientApplication(msalConfig)

it("renders without crashing", async () => {
    const div = document.createElement("div")
    ReactDOM.render(
        <MemoryRouter>
            <App pca={msalInstance} />
        </MemoryRouter>,
        div
    )
    await new Promise((resolve) => {
        return setTimeout(resolve, 1000)
    })
})
