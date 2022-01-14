import React from 'react'
import { TextField } from '@fluentui/react'
import { StudyConfig } from '../../models/config.model'

interface Props {
    currentStudy?: StudyConfig
  callBack: any
}

export const StudyNameTextField = (props: Props) => {
    const [textFieldValue, setTextFieldValue] = React.useState('')
    const [previouStudyID, setPreviouStudyID] = React.useState('-2')
  const handleTextInput = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
      ) => {
          setPreviouStudyID(props.currentStudy?.StudyID ?? '')
      setTextFieldValue(newValue || '')
      props.callBack(newValue)
    },
    [props]
  )

    const getSelectedKey = (currentStudy: StudyConfig | undefined) => {
        // To make the field editable for update as well. OR condition is to clear the textbox when user wants to create a new study
        if (((currentStudy) && (currentStudy?.StudyID != previouStudyID)) || (previouStudyID !== '-2' && currentStudy === undefined)) {
            // alert(currentStudy?.StudyName.concat(' textbox:', textFieldValue))
            return currentStudy?.StudyName

        }
    return textFieldValue
  }

  return (
    <TextField
      label="Study Name"
      required
      placeholder="e.g. WVD Study"
      aria-label="Study Name"
      value={getSelectedKey(props.currentStudy)}
      onChange={handleTextInput}
    />
  )
}
