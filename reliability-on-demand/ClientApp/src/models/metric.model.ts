import { IDropdownOption, SelectableOptionMenuItemType } from '@fluentui/react'
import { onlyUnique } from '../components/helpers/utils'

export interface Metric {
  MetricName: string
  Vertical: string
  MinUsageInMS: number
  HighUsageMinInMS: number
  FailureRateInHour: number
  MetricGoal: number
  IsUsage: boolean
  StudyId?: number
  Key: string
  MetricType: string
  UniqueKey: string
  HashString: string
}

export const getDistinctVerticals = (arr: Metric[]): string[] => {
  const extractedVerticals = arr.map((item) => {
    return item.Vertical
  })
  const uniqueVerticals = onlyUnique(extractedVerticals)
  return uniqueVerticals
}

export const getDistinctMetricNames = (arr: Metric[]): string[] => {
  const extractedMetricNames = arr.map((item) => {
    return item.MetricName
  })
  const uniqueMetricNames = onlyUnique(extractedMetricNames)
  return uniqueMetricNames
}

export const generateDropdownOptions = (
  defaultMetrics: Metric[],
  userMetrics: Metric[]
): IDropdownOption[] => {
  const combinedOptions: IDropdownOption[] = []
  // DEFAULT METRICS
  combinedOptions.push({
    key: 'HEADER : Defaults', // using this style HEADER : to clearly separate headers from other items in the dropdown
    text: 'Defaults',
    itemType: SelectableOptionMenuItemType.Header,
  })
  // Add All entries from DEFAULTS TABLE
  const defaultOptions = defaultMetrics.map((item) => {
    return {
      key: item.UniqueKey,
      text: item.MetricName,
    }
  })
  for (const item of defaultOptions) combinedOptions.push(item)

  // USER METRICS
  combinedOptions.push({
    key: 'HEADER : User Configured',
    text: 'User Configured',
    itemType: SelectableOptionMenuItemType.Header,
  })

  // Add All entries from USER METRICS TABLE
  const userOptions = userMetrics.map((item) => {
    return {
      key: item.UniqueKey,
      text: item.MetricName,
    }
  })
  for (const item of userOptions) combinedOptions.push(item)
  return combinedOptions
}

/**
 *
 * @param defaultMetrics array of default metrics
 * @param userMetrics array of previously configured user metrics if any
 * @param selectedItemKey dropdown option user has selected
 * @returns matched metric (could be default or user)
 */
export const findMetrics = (
  defaultMetrics: Metric[],
  userMetrics: Metric[],
  selectedItemKey: string
): [Metric | undefined, boolean] => {
  // find selection on default
  const ans1 = defaultMetrics.find((item) => {
    return item.UniqueKey === selectedItemKey
  })
  if (ans1 !== undefined) return [ans1, false]
  // find selection on user
  const ans2 = userMetrics.find((item) => {
    return item.UniqueKey === selectedItemKey
  })
  if (ans2 !== undefined) return [ans2, true]
  // when no match found
  return [undefined, false]
}
