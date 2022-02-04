import React from 'react'
import {
  DatePicker,
  defaultDatePickerStrings,
  mergeStyleSets,
} from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import { StudyConfig } from '../../models/config.model'

interface Props {
  currentStudy?: StudyConfig
  callBack: any
}

const controlClass = mergeStyleSets({
  control: {
    margin: '0 0 15px 0',
    maxWidth: '300px',
  },
})

export const ExpiryDatePicker = (props: Props) => {
  const today = useConst(new Date(Date.now()))
  const [value, setValue] = React.useState<Date | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay() + 90
    )
  )
  const [previouStudyID, setPreviouStudyID] = React.useState('-2')

  const getDefaultExpiryDate = (currentStudy?: StudyConfig) => {
    if (
      (currentStudy && currentStudy?.StudyID != previouStudyID) ||
      (previouStudyID !== '-2' && currentStudy === undefined)
    ) {
      // uncomment this section if you prefer to set default expiry to 3 months from now
      // let now = new Date();
      // let current = new Date(now.getFullYear(), now.getMonth() + 3, now.getDay());
      // return current;
      return new Date(
        currentStudy?.Expiry ??
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDay() + 90
          )
      )
    }

    return value
  }

  const onChange = (e: any) => {
    setPreviouStudyID(props.currentStudy?.StudyID ?? '')
    setValue(e as Date)
    props.callBack(e)
  }

  return (
    <DatePicker
      label="Select an Expiry Date"
      value={getDefaultExpiryDate(props.currentStudy)}
      strings={defaultDatePickerStrings}
      isRequired={true}
      className={controlClass.control} // make sure we don't expand to full width
      minDate={today}
      onSelectDate={onChange}
      showGoToToday={true}
    />
  )
}
