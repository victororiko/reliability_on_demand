import React from 'react'

interface Props {
  message: string
}

export const MessageBox = (props: Props) => {
  return <div>{props.message ?? 'no message to show'}</div>
}
