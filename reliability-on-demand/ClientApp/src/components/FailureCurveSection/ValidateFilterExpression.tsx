import { DefaultButton, Label, TooltipHost } from '@fluentui/react'
import React from 'react'
import { FilterExpTable } from '../../models/failurecurve.model'
import { getRelationalOperatorCount, showFilterExpression } from './service'

type Props = {
  FilterExpArr: FilterExpTable[]
  callBack: any
}

export const ValidateFilterExpression = (props: Props) => {
  const [validateStatement, setValidateStatement] = React.useState<string>('')

  const handleClick = () => {
    const relationalOpCount = getRelationalOperatorCount(props.FilterExpArr)
    let flag: boolean = false
    if (relationalOpCount !== props.FilterExpArr.length - 1) {
      setValidateStatement('Relational operator not set properly')
      props.callBack(false)
      return
    }

    for (const ele of props.FilterExpArr) {
      if (ele.UIInputDataType === 'number' && isNaN(Number(ele.PivotValue))) {
        setValidateStatement(`Number expected in ${ele.PivotName}`)
        props.callBack(false)
        flag = true
        break
      } else if (ele.Operator === null || ele.Operator === '') {
        setValidateStatement(`Operator null issue in ${ele.Operator}`)
        props.callBack(false)
        flag = true
        break
      } else if (ele.PivotValue === null || ele.PivotValue === '') {
        setValidateStatement(`Pivot Value null issue in ${ele.PivotValue}`)
        props.callBack(false)
        flag = true
        break
      }
    }

    if (flag === false) {
      setValidateStatement(
        `${'Filter expression has been validated successfully -> '}${showFilterExpression(
          props.FilterExpArr
        )}`
      )
      props.callBack(true)
    }
  }

  return (
    <div>
      <TooltipHost content="Click to validate your filter expression">
        <div>
          <DefaultButton
            text="Validate Filter Expression"
            onClick={handleClick}
            allowDisabledFocus
            disabled={false}
            checked={false}
          />
        </div>
      </TooltipHost>
      <Label>{validateStatement}</Label>
    </div>
  )
}
