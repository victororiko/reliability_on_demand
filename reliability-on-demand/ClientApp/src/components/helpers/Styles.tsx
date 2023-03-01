import { createTheme, getTheme, IStackTokens, ITheme } from "@fluentui/react"
// Separator related styles
export const largeTitle: ITheme = createTheme({
    fonts: {
        medium: {
            fontSize: "30px",
        },
    },
})
// Stack related stuff
export const containerStackTokens: IStackTokens = {
    childrenGap: 10,
}

export const horizontalStackTokens: IStackTokens = {
    childrenGap: 50,
    padding: 10,
}

export const fixedWidth300px = {
    root: { width: "300px;" },
}

const theme = getTheme()
export const lightBlueBox = {
    root: [
        {
            background: theme.palette.themeLighterAlt,
            selectors: {
                ":hover": {
                    background: theme.palette.themeLighter,
                },
            },
        },
    ],
}

export const DeeplinkStyle = {
    display: "block",
    p: 1,
    m: 1,
    bgcolor: "grey.100",
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: 4,
    fontSize: "0.96rem",
    fontWeight: "500",
}
