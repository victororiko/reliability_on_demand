import { onlyUnique } from '../helpers/utils'

export interface Metric {
  MetricName: string
  Vertical: string
  MinUsageInMS: number
  HighUsageMinInMS: number
  FailureRateInHour: number
  MetricGoal: number
  IsUsage: boolean
  StudyId?: number
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
