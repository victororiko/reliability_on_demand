import axios from 'axios'
import * as React from 'react'
import { MultiSelectVerticalList } from './MultiSelectVerticalList'
import { FailureModesSelection } from './FailureModesSelection'
import { ConfigureVerticalButton } from './ConfigureVerticalButton'
import { MultiSelectPivots } from './MultiSelectPivots'
import { PivotsDetailedList } from './PivotsDetailedList'
import { Loading } from '../helpers/Loading'
import { WikiLink } from '../helpers/WikiLink'
import {
  Vertical,
  Pair,
  Pivot,
  PivotSQLResult,
} from '../../models/failurecurve.model'
import {
  extractModesFromVerticalPair,
  getPivotIDs,
  getPivotTableFromPivotSQL,
  AddNewSelectedPivots,
} from './service'
import { PivotTable } from '../FailureCurve/model'

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
  const [modeSelectionVisible, setModeSelectionVisible] =
    React.useState<Boolean>(false)
  const [modes, setModes] = React.useState<Pair[]>([])
  const [pivots, setPivots] = React.useState<Pivot[]>([])
  const [modeSelected, setModeSelected] = React.useState<Boolean>(false)
  const [selectedPivots, setSelectedPivots] = React.useState<PivotSQLResult[]>(
    []
  )
  const [pivotDetailedList, setPivotDetailedList] = React.useState<
    PivotTable[]
  >([])
  const [selectedPivotsIDs, setSelectedPivotsIDs] = React.useState<number[]>([])

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

  const configurePivotsForSelectedVerticals = () => {
    loadFailureVerticalModes()
    setModeSelectionVisible(true)
  }

  const hideConfigurationForSelectedVerticals = () => {
    setModeSelectionVisible(false)
    setModeSelected(false)
  }

  const loadFailureCurvePivots = (sourcesubtype: string) => {
    setPivots([])
    axios
      .get(`api/Data/GetAllFailurePivotNamesForAVertical/${sourcesubtype}`)
      .then((res) => {
        setPivots(res.data)
        setModeSelected(true)
        loadSelectedPivots(sourcesubtype)
      })
      .catch((err) => {
        console.error('Axios Error:', err.message)
      })
  }

  const loadSelectedPivots = (sourcesubtype: string) => {
    setSelectedPivots([])
    axios
      .get(
        `api/Data/GetAllConfiguredFailurePivotsForAVertical/sourcesubtype/${sourcesubtype}/studyid/${props.studyid}`
      )
      .then((res) => {
        if (res.data !== null) {
          setSelectedPivots(res.data)
          setSelectedPivotsIDs(getPivotIDs(res.data))
          loadDetailedListRows(res.data)
        }
      })
      .catch((err) => {
        console.error('Axios Error:', err.message)
      })

    if (selectedPivots === null || selectedPivots.length === 0) {
      axios
        .post(
          'api/Data/GetAllDefaultFailurePivotsForAVertical',
          sourcesubtype,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          if (res.data !== null) {
            setSelectedPivots(res.data)
            setSelectedPivotsIDs(getPivotIDs(res.data))
            loadDetailedListRows(res.data)
          }
        })
        .catch((err) => {
          console.log('Axios Error:', err.message)
        })
    }
  }

  const loadFailureVerticalModes = () => {
    setModes(extractModesFromVerticalPair(selectedverticals))
  }

  const loadDetailedListRows = (data: PivotSQLResult[]) => {
    const temp: PivotTable[] = getPivotTableFromPivotSQL(data)
    setPivotDetailedList(temp)
  }

  const updateDetailedListRows = (data: number[], input: Pivot[]) => {
    const temp: PivotTable[] = []
    // Adding the rows that from detailed list input that are still selected
    // Also filter the deselected pivots
    for (const ele of pivotDetailedList) {
      for (const e of data) {
        if (ele.PivotID === e) {
          temp.push(ele)
          break
        }
      }
    }

    // Add new selected checkbox
    const updatedPivotTable = AddNewSelectedPivots(data, input, temp)

    setSelectedPivotsIDs(data)
    setPivotDetailedList(updatedPivotTable)
  }

  React.useEffect(() => {
    setLoading(true)
    loadConfiguredVerticals()
    loadVerticals()
  }, [loadConfiguredVerticals])

  const modeSelection = !modeSelectionVisible ? (
    ''
  ) : (
    <div>
      <FailureModesSelection modes={modes} callBack={loadFailureCurvePivots} />
    </div>
  )

  const changeDetailedListInput = (input: PivotTable[]) => {
    setPivotDetailedList(input)
  }

  const pivotSection = !modeSelected ? (
    ''
  ) : (
    <div>
      <MultiSelectPivots
        pivots={pivots}
        callBack={updateDetailedListRows}
        selectedOptions={selectedPivotsIDs}
      />
      <PivotsDetailedList
        data={pivotDetailedList}
        callBack={changeDetailedListInput}
      />
    </div>
  )

  return (
    <div>
      {loading ? (
        <Loading message="Getting Data for Failure Section - hang tight" />
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
          <ConfigureVerticalButton
            changepivotcallBack={configurePivotsForSelectedVerticals}
            hidecallBack={hideConfigurationForSelectedVerticals}
          />
          {modeSelection}
          {pivotSection}
        </div>
      )}
    </div>
  )
}
