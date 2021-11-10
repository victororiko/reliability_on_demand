import React from 'react'
import { Spinner } from '@fluentui/react'

interface Props {
  message: string
}

export const Loading = (props: Props) => <Spinner label={props.message} />
