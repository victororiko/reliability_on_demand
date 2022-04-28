import { IDropdownOption } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { StudyConfig } from '../../models/config.model'
import { MyDropdown } from '../helpers/MyDropdown'
import { hardCodedFrequencies } from '../helpers/utils'
import { getFrequencySelectionFromStudy } from './model'

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  currentStudy?: StudyConfig
  callBack: any
}

export const FrequencyDropdown = (props: Props) => {
  const [selection, setSelection] = useState<IDropdownOption | undefined>(
    getFrequencySelectionFromStudy(hardCodedFrequencies, props?.currentStudy)
  )
  useEffect(() => {
    const ans = getFrequencySelectionFromStudy(
      hardCodedFrequencies,
      props?.currentStudy
    )
    setSelection(ans)
  }, [props.currentStudy])

  const handleFrequencyChange = (value: IDropdownOption) => {
    props.callBack(value.key)
    setSelection(value)
  }

  return (
    <MyDropdown
      data={hardCodedFrequencies}
      enabled
      handleOptionChange={handleFrequencyChange}
      label="Cache Frequency"
      placeholder="Please select a frequency for your study"
      required
      selectedOption={selection}
    />
  )
}
