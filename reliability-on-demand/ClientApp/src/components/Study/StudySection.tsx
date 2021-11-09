/* eslint-disable react/no-direct-mutation-state */
import * as React from 'react'
import { StudyConfig } from '../../models/config.model'
import { StudyComboBox } from './StudyComboBox'
import { StudyNameTextField } from './StudyNameTextField'
import { FrequencyDropdown } from './FrequencyDropdown'
import { ExpiryDatePicker } from './ExpiryDatePicker'
import { ObservationWindowDropdown } from './ObservationWindowDropdown'
import { AddStudyButton } from './AddStudyButton'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Loading } from '../helpers/Loading'

export interface IStudySectionProps {
  team_id: number
  callBack: any
}

export const StudySection = (props: IStudySectionProps) => {
  const [studyConfigs, setStudyConfigs] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  // starting state undefined keeps rest of the UI active
  const [selectedStudy, setSelectedStudy] = useState<StudyConfig | undefined>(undefined) 
  const [newStudyName, setNewStudyName] = useState<string>('')
  const [newCacheFrequency, setNewCacheFrequency] = useState<number>(0)
  const [newExpiry, setNewExpiry] = useState<Date>()
  const [newObservationWindowDays, setNewObservationWindowDays] = useState<number>(0)

  const loadStudies = (id: number) => {
    axios.get(`api/Data/GetStudies/${props.team_id}`).then((res) => {
      if (res.data) {
        console.table(res.data)
        setStudyConfigs(res.data)
      } else {
        console.log('no studies found')
        setStudyConfigs([])
      }
      setLoading(false)
    })
  }

  // helper methods
  // Study Selection
  const selectCurrentStudy = (selection: string) => {
    let mySelection: StudyConfig | undefined = getStudyFromString(selection)
    setSelectedStudy(mySelection)
    props.callBack(mySelection ? mySelection.StudyID : -1)
  }
  const getStudyFromString = (selection: string): StudyConfig | undefined => {
    // extracting StudyName property out of each element and comparing it.
    let parsedStudy = studyConfigs.find(({ StudyName }) => StudyName === selection)
    return parsedStudy
  }

  // New Study Creation
  // Set new study's name based on user's input
  const getUserStudyName = (valueFromTextField: string) => {
    setNewStudyName(valueFromTextField)
  }
  const getUserFrequency = (frequencyFromDropdown: number) => {
    console.debug(frequencyFromDropdown)
    setNewCacheFrequency(frequencyFromDropdown)
  }
  const getUserExpiryDate = (dateFromDatePicker: Date) => {
    setNewExpiry(dateFromDatePicker)
  }
  const getUserObservationWindow = (selectionDays: number) => {
    setNewObservationWindowDays(selectionDays)
  }

  const studyExists = (newStudy: StudyConfig): boolean => {
    let dupeFound = studyConfigs.some((oldStudy: StudyConfig) => {
      return (
        oldStudy.StudyName === newStudy.StudyName &&
        oldStudy.CacheFrequency === newStudy.CacheFrequency
      )
      // FIXME: figure out how to check for equivalent dates -->  && oldStudy.Expiry.valueOf === newStudy.Expiry.valueOf
    })
    return dupeFound
  }
  const addNewStudyToBackend = () => {
    // Validate new study first
    // Study name check
    let studyToAdd = {
      StudyName: newStudyName,
      CacheFrequency: newCacheFrequency,
      Expiry: newExpiry,
      ObservationWindowDays: newObservationWindowDays,
    } as StudyConfig
    if (newStudyName === null || newStudyName === undefined || newStudyName === '')
      alert('please specify a Name for the study you are adding')
    // Frequency check
    else if (newCacheFrequency === null || newCacheFrequency === undefined)
      alert('please specify a Frequency for the study you are adding')
    // Expiry Date check
    else if (newExpiry === null || newExpiry === undefined)
      alert('please specify an Expiry Date for the study you are adding')
    // Check if study exists
    else if (studyExists(studyToAdd))
      alert('study already exists - please change one of the required fields')
    else {
      alert(`New Study to be added = \n${JSON.stringify(studyToAdd, null, 4)}`)
      // add missing properties to pass a full study to backend
      studyToAdd.LastModifiedDate = new Date()
      studyToAdd.TeamID = props.team_id
      axios.post('api/Data/AddStudy', studyToAdd).then(() => {
        loadStudies(props.team_id)
      })
    }
  }
  useEffect(() => {
    setLoading(true)
    loadStudies(props.team_id)
    setSelectedStudy(undefined)
  }, [props.team_id])

  return (
    <div>
      {loading ? (
        <Loading message={'Getting Data for Study Section - hang tight'} />
      ) : (
        <div>
          <h1>Study Section</h1>
          <StudyComboBox data={studyConfigs} callBack={selectCurrentStudy} />
          <StudyNameTextField currentStudy={selectedStudy} callBack={getUserStudyName} />
          <FrequencyDropdown currentStudy={selectedStudy} callBack={getUserFrequency} />
          <ExpiryDatePicker currentStudy={selectedStudy} callBack={getUserExpiryDate} />
          <ObservationWindowDropdown
            currentStudy={selectedStudy}
            callBack={getUserObservationWindow}
          />
          <AddStudyButton currentStudy={selectedStudy} callBack={addNewStudyToBackend} />
        </div>
      )}
    </div>
  )
}
