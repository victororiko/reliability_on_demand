import { IDropdownOption } from '@fluentui/react'
import { Vertical, Pair } from '../../models/failurecurve.model'

// converting verticals to Idropdown Pair
export const getVerticalNames = (
  verticals: Vertical[]
): IDropdownOption<Pair>[] => {
  const result = verticals.map(extractVerticalName)
  return result
}

// converting vertical type to Pair
export const extractVerticalName = (item: Vertical) => {
  const p: Pair = {
    key: item.PivotSourceSubType.concat('_', item.VerticalName),
    text: item.VerticalName,
  }
  return p
}
