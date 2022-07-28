export interface StudyPivotConfig {
  PivotKey: string
  StudyConfigID: number
  PivotScopeID: number
  PivotScopeValue?: string
  PivotOperator?: string
  UIDataType?: string
  RelationalOperator?: string
  PivotName?: string
}

export interface FilterExpTable {
  RelationalOperator: string
  PivotName: string
  Operator: string
  PivotValue: string
  PivotScopeID: number
  UIInputDataType: string
  PivotKey: string
}

export interface Pivot {
  PivotName: string
  UIDataType: string
  PivotKey: string
  PivotScopeID: number
  RelationalOperator: string
}

export interface StudyConfigIDWithScopesInquiry {
  StudyConfigID: number
  PivotScopeIDs: number[]
}
