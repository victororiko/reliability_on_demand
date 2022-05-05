import axios from 'axios'
import * as React from 'react'
import { MultiSelectVerticalList } from './MultiSelectVerticalList'
import { Loading } from '../helpers/Loading'
import { WikiLink } from '../helpers/WikiLink'
import { Vertical, Pair } from '../../models/failurecurve.model'

export interface Props {
  studyid: number
}

export const FailureCurve = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [verticals, setVerticals] = React.useState<Vertical[]>([])
  const [configuredverticals, setConfiguredVerticals] = React.useState<
    Vertical[]
  >([])
  const [selectedverticals, setSelectedVerticals] = React.useState<Pair[]>([])

  const loadVerticals = () => {
    axios.get('api/Data/GetAllMainVertical').then((res) => {
      if (res.data) {
        setVerticals(res.data)
      } else {
        setVerticals([])
      }
      setLoading(false)
    })
  }

  const loadConfiguredVerticals = React.useCallback(() => {
    if (props.studyid > 0) {
      axios
        .get(`api/Data/GetConfiguredVerticalForAStudy/${props.studyid}`)
        .then((res) => {
          setConfiguredVerticals(res.data)
        })
        .catch((err) => {
          console.error('Axios Error:', err.message)
        })
    } else setConfiguredVerticals([])
  }, [props.studyid])

  const selectedVerticals = (selection: Pair[]) => {
    setSelectedVerticals(selection)
  }

  React.useEffect(() => {
    setLoading(true)
    loadConfiguredVerticals()
    loadVerticals()
  }, [loadConfiguredVerticals])

  return (
    <div>
      {loading ? (
        <Loading message="Getting Data for Study Section - hang tight" />
      ) : (
        <div>
          <h1>Failure Curve Section</h1>
          <WikiLink
            title="Wiki for this page"
            url="https://www.osgwiki.com/wiki/RIOD_-_Failure_Curve_Section"
          />
          <MultiSelectVerticalList
            data={verticals}
            configuredverticals={configuredverticals}
            callBack={selectedVerticals}
          />
        </div>
      )}
    </div>
  )
}
