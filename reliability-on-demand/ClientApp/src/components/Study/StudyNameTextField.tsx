import React, { useEffect } from 'react'
import { TextField } from '@fluentui/react'
import { StudyConfig } from '../../models/study.model'

interface Props {
  currentStudy?: StudyConfig
  callBack: any
}

export const StudyNameTextField = (props: Props) => {
  const [textFieldValue, setTextFieldValue] = React.useState(
    props.currentStudy?.StudyName
  )
  useEffect(() => {
    setTextFieldValue(props.currentStudy?.StudyName || '')
  }, [props.currentStudy])

  const handleTextInput = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setTextFieldValue(newValue || '')
      props.callBack(newValue)
    },
    [props]
  )

  return (
    <TextField
      label="Study Name"
      required
      placeholder="e.g. WVD Study"
      aria-label="Study Name"
      value={textFieldValue}
      onChange={handleTextInput}
    />
  )
}
