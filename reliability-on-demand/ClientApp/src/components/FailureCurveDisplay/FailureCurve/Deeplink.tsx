import { Box, Link, Stack, Typography } from "@mui/material"
import React from "react"
import CopyToClipboardButton from "../../helpers/CopyToClipboardButton"

interface IDeeplinkProps {
    content: string
}

export const Deeplink = (props: IDeeplinkProps) => {
    return (
        <div style={{ width: "100%" }}>
            <Box
                component="span"
                sx={{
                    display: "block",
                    p: 1,
                    m: 1,
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#101010" : "#fff"),
                    color: (theme) => (theme.palette.mode === "dark" ? "grey.300" : "grey.800"),
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Typography sx={{ fontWeight: "bold" }}>Deeplink</Typography>
                    <Link href={props.content} target="_blank">
                        {props.content}
                    </Link>
                    <CopyToClipboardButton text={props.content} />
                </Stack>
            </Box>
        </div>
    )
}
