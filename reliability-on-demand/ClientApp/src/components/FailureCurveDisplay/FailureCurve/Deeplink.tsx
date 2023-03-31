import { Box, Link, Stack, Typography } from "@mui/material"
import React from "react"
import CopyToClipboardButton from "../../helpers/CopyToClipboardButton"
import { DeeplinkStyle } from "../../helpers/Styles"

interface IDeeplinkProps {
    content: string
}

export const Deeplink = (props: IDeeplinkProps) => {
    return (
        <div style={{ width: "100%" }}>
            <Box component="span" sx={DeeplinkStyle}>
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
