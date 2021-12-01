import React from 'react'
import { FilterExpTable } from './model'

interface Props {
  expression: FilterExpTable[]
}

export const Expression = (props: Props) => {
  return <div>Pretty Filter Expression {props.expression}</div>
}
