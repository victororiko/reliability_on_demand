import { IComboBoxOption } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PivotSource } from '../../models/pivot.model'
import { Loading } from '../helpers/Loading'
import { MySingleSelectComboBox } from '../helpers/MySingleSelectComboBox'
import {
  convertComplexTypeToOptions,
  PopulationSourceType,
} from '../helpers/utils'
import { PivotConfigDetails } from './PivotConfigDetails'

type Props = {
  StudyConfigID: number
}

export const Pivots = (props: Props) => {
  const [pivotSources, setPivotSources] = useState<PivotSource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPivotSource, setSelectedPivotSource] = useState<
    IComboBoxOption | undefined
  >(undefined)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`api/Data/GetAllSourcesForGivenSourceType/${PopulationSourceType}`)
      .then((response) => {
        if (response.data) setPivotSources(response.data as PivotSource[])
        else setPivotSources([])
        setLoading(false)
        setSelectedPivotSource(undefined) // let the user select a pivot source at each render
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }, [props.StudyConfigID])

  // callback
  const print = (selection: IComboBoxOption) => {
    setSelectedPivotSource(selection)
  }

  return (
    <div>
      {loading ? (
        <Loading message="Getting Population based Pivot Sources for you - hang tight" />
      ) : (
        <MySingleSelectComboBox
          options={convertComplexTypeToOptions(
            pivotSources,
            'PivotSource',
            'PivotSource'
          )}
          callback={print}
          label="Pivot Source"
          placeholder="type a Pivot Source to search OR select from the list"
          selectedItem={undefined} // this shows placeholder text upon load
        />
      )}
      {selectedPivotSource ? (
        <PivotConfigDetails
          pivotSource={selectedPivotSource.text}
          StudyConfigID={props.StudyConfigID}
        />
      ) : (
        ''
      )}
    </div>
  )
}
