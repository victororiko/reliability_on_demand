import axios from 'axios'
import * as React from 'react'
import { IDropdownOption } from '@fluentui/react'
import { MultiSelectVerticalList } from './MultiSelectVerticalList'
import { FailureModesSelection } from './FailureModesSelection'
import { ConfigureVerticalButton } from './ConfigureVerticalButton'
import { MultiSelectPivots } from './MultiSelectPivots'
import { PivotsDetailedList } from './PivotsDetailedList'
import { FilterExpressionDetailedList } from './FilterExpressionDetailedList'
import { ConfigureFilterExpressionButton } from './ConfigureFilterExpressionButton'
import { ValidateFilterExpression } from './ValidateFilterExpression'
import { AddOrUpdateButton } from './AddOrUpdateButton'
import { Loading } from '../helpers/Loading'
import { WikiLink } from '../helpers/WikiLink'
import {
  Vertical,
  Pivot,
  PivotSQLResult,
  FailureConfig,
  FilterExpTable,
  PivotTable,
} from '../../models/failurecurve.model'
import {
  extractModesFromVerticalPair,
  getPivotIDs,
  getPivotTableFromPivotSQL,
  AddNewSelectedPivots,
  loadFilterExpressionTable,
  getAllFilteredPivots,
  getVerticalNamesFromPair,
  getVerticalNames,
} from './service'

export interface Props {
  studyid: number
}

export const FailureCurve = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [verticals, setVerticals] = React.useState<Vertical[]>([])
  const [configuredverticals, setConfiguredVerticals] = React.useState<
    Vertical[]
  >([])
  const [selectedverticals, setSelectedVerticals] = React.useState<
    IDropdownOption[]
  >([])
  const [modeSelectionVisible, setModeSelectionVisible] =
    React.useState<Boolean>(false)
  const [modes, setModes] = React.useState<IDropdownOption[]>([])
  const [pivots, setPivots] = React.useState<Pivot[]>([])
  const [modeSelected, setModeSelected] = React.useState<Boolean>(false)
  const [pivotDetailedList, setPivotDetailedList] = React.useState<
    PivotTable[]
  >([])
  const [selectedPivotsIDs, setSelectedPivotsIDs] = React.useState<number[]>([])
  const [configureFilterExpClicked, setConfigureFilterExpClicked] =
    React.useState<Boolean>(false)
  const [filterExpTable, setFilterExpTable] = React.useState<FilterExpTable[]>(
    []
  )
  const [selectedMode, setSelectedMode] = React.useState<string>('')
  const [filterPivots, setFilterPivots] = React.useState<IDropdownOption[]>([])
  const [isValidFilterExp, setIsValidFilterExp] = React.useState<boolean>(false)
  const [buttonName, setButtonName] = React.useState<string>('')
  const [dataSaved, setDataSaved] = React.useState<boolean>(false)

  const loadVerticals = () => {
    axios.get('api/Data/GetAllVerticals').then((res) => {
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
          setSelectedVerticals(getVerticalNames(res.data))
        })
        .catch((err) => {
          console.error('Axios Error:', err.message)
        })
    } else setConfiguredVerticals([])
  }, [props.studyid])

  const selectedVerticals = (selection: IDropdownOption[]) => {
    setSelectedVerticals(selection)
    loadFailureVerticalModes(selection, false)
  }

  const configurePivotsForSelectedVerticals = () => {
    loadFailureVerticalModes(selectedverticals, true)
    setModeSelectionVisible(true)
  }

  const hideConfigurationForSelectedVerticals = () => {
    setModeSelectionVisible(false)
    setModeSelected(false)
    setConfigureFilterExpClicked(false)
    setIsValidFilterExp(false)
  }

  const loadFailureCurvePivots = (sourcesubtype: string, flag: boolean) => {
    setPivots([])
    setSelectedMode(sourcesubtype)
    axios
      .get(`api/Data/GetAllFailurePivotNamesForAVertical/${sourcesubtype}`)
      .then((res) => {
        setPivots(res.data)
        setModeSelected(flag)
        loadSelectedPivots(sourcesubtype)
      })
      .catch((err) => {
        console.error('Axios Error:', err.message)
      })
  }

  const loadSelectedPivots = (sourcesubtype: string) => {
    axios
      .get(
        `api/Data/GetAllConfiguredFailurePivotsForAVertical/sourcesubtype/${sourcesubtype}/studyid/${props.studyid}`
      )
      .then((res) => {
        if (res.data) {
          setSelectedPivotsIDs(getPivotIDs(res.data))
          loadDetailedListRows(res.data)
          setButtonName('Update Failure Curve')
        } else {
          getDefaultPivots(sourcesubtype)
        }
      })
      .catch((err) => {
        console.error('Axios Error:', err.message)
      })
  }

  const getDefaultPivots = (sourcesubtype: string) => {
    axios
      .post('api/Data/GetAllDefaultFailurePivotsForAVertical', sourcesubtype, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.data !== null) {
          setSelectedPivotsIDs(getPivotIDs(res.data))
          loadDetailedListRows(res.data)
          setButtonName('Add Failure Curve')
        }
      })
      .catch((err) => {
        console.log('Axios Error:', err.message)
      })
  }

  const loadFailureVerticalModes = (
    input: IDropdownOption[],
    flag: boolean
  ) => {
    setSelectedVerticals(input)
    setModes(extractModesFromVerticalPair(input))
    if (modes.length === 2) {
      let mode = ''
      for (let i = 0; i < modes.length; i++) {
        if (!modes[i].key.toString().match('Select Mode')) {
          mode = modes[i].key.toString()
        }
      }
      setSelectedMode(mode)
      loadFailureCurvePivots(mode, flag)
    }
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
      <FailureModesSelection
        modes={modes}
        select={selectedMode}
        callBack={loadFailureCurvePivots}
      />
    </div>
  )

  const changeDetailedListInput = (input: PivotTable[]) => {
    setPivotDetailedList(input)
  }

  const loadFilterExpression = () => {
    setConfigureFilterExpClicked(true)
    setFilterExpTable(loadFilterExpressionTable(pivotDetailedList))
    setFilterPivots(getAllFilteredPivots(pivotDetailedList))
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
      <ConfigureFilterExpressionButton callBack={loadFilterExpression} />
    </div>
  )

  const validateFilterExpression = (input: boolean) => {
    setIsValidFilterExp(input)
  }

  const updateFilterExpTable = (input: FilterExpTable[]) => {
    setFilterExpTable(input)
  }

  const addOrUpdateStudy = (input: FailureConfig) => {
    axios
      .post('api/Data/SavedFailureConfig', input)
      .then((response) => {
        setDataSaved(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const filterExpressionSection = !configureFilterExpClicked ? (
    ''
  ) : (
    <div>
      <FilterExpressionDetailedList
        filterExpTable={filterExpTable}
        filterExpPivots={filterPivots}
        callBack={updateFilterExpTable}
      />
      <ValidateFilterExpression
        FilterExpArr={filterExpTable}
        callBack={validateFilterExpression}
      />
    </div>
  )

  const finalButton = !isValidFilterExp ? (
    ''
  ) : (
    <AddOrUpdateButton
      ButtonName={buttonName}
      callBack={addOrUpdateStudy}
      dataSaved={dataSaved}
      filterExpTable={filterExpTable}
      pivots={pivotDetailedList}
      studyid={props.studyid}
      verticals={getVerticalNamesFromPair(selectedverticals)}
      pivotSourceSubType={selectedMode}
    />
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
          {filterExpressionSection}
          {finalButton}
        </div>
      )}
    </div>
  )
}
