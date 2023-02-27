import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Snackbar } from '@mui/material';
import React, { useState } from 'react';

interface ICopyToClipboardButtonProps
{
    text:string
}

const CopyToClipboardButton = (props:ICopyToClipboardButtonProps) => {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
      setOpen(true)
      navigator.clipboard.writeText(props.text)
    }
    
    return (
        <>
        <ContentCopyIcon onClick={handleClick} />
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </>
    )
}

export default CopyToClipboardButton