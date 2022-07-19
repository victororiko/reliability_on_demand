import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PivotSource } from '../../models/pivot.model'
import { Loading } from '../helpers/Loading'
import PivotSourceDropdown from './PivotSourceDropdown'

type Props = {
  StudyConfigID: number
}

export const Pivots = (props: Props) => {
  const [pivotSources, setPivotSources] = useState<PivotSource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get('api/Data/GetPopulationPivotSources')
      .then((response) => {
        if (response.data) setPivotSources(response.data as PivotSource[])
        else setPivotSources([])
        setLoading(false)
      })
      .catch((exception) => {
        return console.error(exception)
      })
  }, [])

  return (
    <div>
      {loading ? (
        <Loading message="Getting Population based Pivot Sources for you - hang tight" />
      ) : (
        <PivotSourceDropdown
          pivotSources={pivotSources}
          StudyConfigID={props.StudyConfigID}
        />
      )}
    </div>
  )
}
