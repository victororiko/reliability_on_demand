import React from 'react'

interface Props {
  message: any
  isJSON?: boolean
}

export const MessageBox = (props: Props) => {
  return (
    <div>
      {props.isJSON ? (
        <pre>
          <code>{JSON.stringify(props.message, null, '  ')}</code>
        </pre>
      ) : (
        props.message
      )}
    </div>
  )
}
