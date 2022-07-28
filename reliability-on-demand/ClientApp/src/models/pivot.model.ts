export interface PivotSource {
  PivotSource: string
}

export interface PivotConfig {
  StudyConfigID: number
  PivotKey: string
  AggregateBy: boolean
  PivotSourceSubType: string
  PivotScopeOperator: string
  PivotScopeID: number
}
