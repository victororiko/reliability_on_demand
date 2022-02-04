import React from 'react'
import { PrimaryButton } from '@fluentui/react'
import { StudyConfig } from '../../models/config.model'

interface Props {
  ButtonName: string
  callBack: any
}

export const AddStudyButton = (props: Props) => {
  return (
    <PrimaryButton
      text={props.ButtonName}
      onClick={props.callBack}
      allowDisabledFocus
    />
  )
}
