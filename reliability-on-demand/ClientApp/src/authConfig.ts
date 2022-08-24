import { Configuration, PopupRequest } from "@azure/msal-browser"

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "53120218-ee24-4120-afac-5fa41a9cc942",
        authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/",
        redirectUri: "/",
        postLogoutRedirectUri: "/",
    },
}

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["api://3b5d0849-f44a-4dbc-bfda-d9ee45e2ac04/user_impersonation"],
}

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "/api/Data/IsValidUserForAdmin/",
}
