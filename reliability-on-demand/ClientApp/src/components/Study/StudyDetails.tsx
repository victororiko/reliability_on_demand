import { Stack } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StudyConfig } from '../../models/study.model'
import { horizontalStackTokens } from '../helpers/Styles'
import { AddStudyButton } from './AddStudyButton'
import { ExpiryDatePicker } from './ExpiryDatePicker'
import { FrequencyDropdown } from './FrequencyDropdown'
import { ObservationWindowDropdown } from './ObservationWindowDropdown'
import { StudyNameTextField } from './StudyNameTextField'
import { UpdateStudyButton } from './UpdateStudyButton'

type Props = {
  callback: any
  teamid: number
  selectedStudy?: StudyConfig
}

export const StudyDetails = (props: Props) => {
  // At first render make sure no user selections exist - hence the explicit undefined
  const [userFrequency, setUserFrequency] = useState<number | undefined>(
    undefined
  )
  const [userStudyName, setUserStudyName] = useState<string | undefined>(
    undefined
  )
  const [userExpiryDate, setUserExpiryDate] = useState<Date | undefined>(
    undefined
  )
  const [userObservationWindow, setUserObservationWindow] = useState<
    number | undefined
  >(undefined)
  const [isNewStudy, setIsNewStudy] = useState<boolean>(!props.selectedStudy)

  useEffect(() => {
    // Whenever this component is loaded - flush previous user selections
    setUserFrequency(undefined)
    setUserStudyName(undefined)
    setUserExpiryDate(undefined)
    setUserObservationWindow(undefined)
    // Show add button if 'create new study' option is selected in study combobox
    setIsNewStudy(!props.selectedStudy)
  }, [props.selectedStudy])

  // helper methods
  const userInputSensed = (): boolean => {
    if (userFrequency !== undefined) return true
    if (userStudyName !== undefined) return true
    if (userExpiryDate !== undefined) return true
    if (userObservationWindow !== undefined) return true
    return false
  }

  const allRequiredFieldsTouched = (): boolean => {
    if (userFrequency === undefined) return false
    if (userStudyName === undefined) return false
    if (userExpiryDate === undefined) return false
    if (userObservationWindow === undefined) return false
    // at this point you are guaranteed that all fields have been touched
    return true
  }

  const addStudyToBackend = () => {
    const newUserCreatedStudy = {
      CacheFrequency: userFrequency,
      StudyName: userStudyName,
      Expiry: userExpiryDate,
      ObservationWindowDays: userObservationWindow,
      // additional properties that to generate a valid study config object
      TeamID: props.teamid,
      LastRefreshDate: new Date(),
    } as StudyConfig
    axios
      .post(`api/Data/AddStudy`, newUserCreatedStudy)
      .then((result) => {
        props.callback('add button clicked')
        return console.debug(result)
      })
      .catch((err) => {
        console.error(err)
        return alert(
          `${newUserCreatedStudy.StudyName} already exists. Please provide a different value for Study Name`
        )
      })
  }

  // assumption: props.selectedStudy !== undefined
  const updateStudyToBackend = () => {
    if (props.selectedStudy !== undefined) {
      const updatedUserStudy = { ...props.selectedStudy }
      if (userFrequency !== undefined)
        updatedUserStudy.CacheFrequency = userFrequency
      if (userStudyName !== undefined)
        updatedUserStudy.StudyName = userStudyName
      if (userExpiryDate !== undefined) updatedUserStudy.Expiry = userExpiryDate
      if (userObservationWindow !== undefined) {
        updatedUserStudy.ObservationWindowDays = userObservationWindow
      }
      updatedUserStudy.LastRefreshDate = new Date()
      updatedUserStudy.StudyID = props.selectedStudy.StudyID.toString()
      axios
        .post('api/Data/UpdateStudy', updatedUserStudy)
        .then((res) => {
          props.callback('update button clicked')
          return console.debug(res)
        })
        .catch((err) => {
          return console.error(err)
        })
    } else console.error(`props.selectedStudy is ${props.selectedStudy}`)
  }

  return (
    <div>
      <StudyNameTextField
        currentStudy={props?.selectedStudy}
        callBack={setUserStudyName}
      />
      <FrequencyDropdown
        currentStudy={props?.selectedStudy}
        callBack={setUserFrequency}
      />
      <ExpiryDatePicker
        currentStudy={props?.selectedStudy}
        callBack={setUserExpiryDate}
      />
      <ObservationWindowDropdown
        currentStudy={props?.selectedStudy}
        callBack={setUserObservationWindow}
      />
      {/* Display Add, Update and Cancel buttons based on selection from dropdown and touching of fields */}
      {isNewStudy ? (
        allRequiredFieldsTouched() ? (
          <AddStudyButton disabled={false} callback={addStudyToBackend} />
        ) : (
          <AddStudyButton disabled callback={undefined} />
        )
      ) : userInputSensed() ? (
        <Stack horizontal tokens={horizontalStackTokens}>
          <UpdateStudyButton callback={updateStudyToBackend} />
        </Stack>
      ) : (
        ''
      )}
    </div>
  )
}
