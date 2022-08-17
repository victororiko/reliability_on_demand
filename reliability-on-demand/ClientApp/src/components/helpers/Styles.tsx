import { createTheme, IStackTokens, ITheme } from "@fluentui/react"
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
