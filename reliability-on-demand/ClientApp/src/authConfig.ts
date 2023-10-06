import { Configuration, PopupRequest } from "@azure/msal-browser"

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "7820ca9d-cc3c-4e0c-bbea-12a25662adc3",
        authority: "https://login.microsoftonline.com/organizations/",
        redirectUri: "/",
        postLogoutRedirectUri: "/",
    },
}

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["api://7a194e88-fb77-4721-97c2-8334005c8519/user_impersonation"],
}

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "/api/Data/IsValidUserForAdmin/",
}
