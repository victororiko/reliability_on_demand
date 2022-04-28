import React from 'react'
import { PrimaryButton } from '@fluentui/react'

interface Props {
  disabled: boolean
  callback: any
}

export const AddStudyButton = (props: Props) => {
  const handleClick = () => {
    props.callback()
  }
  return (
    <PrimaryButton text="Add" onClick={handleClick} disabled={props.disabled} />
  )
}
