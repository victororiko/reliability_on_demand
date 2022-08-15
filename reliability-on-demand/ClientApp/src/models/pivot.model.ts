import { StudyPivotConfig } from './filterexpression.model'

export interface PivotSource {
  PivotSource: string
}

export interface Pivot extends StudyPivotConfig {
  ADLDataType: string
  IsApportionColumn: boolean
  IsApportionJoinColumn: boolean
  IsKeyColumn: boolean
  IsSelectColumn: boolean
  IsScopeFilter: boolean
  AggregateBy: boolean
  PivotExpression: string
  Verticals?: string[]
  PivotSourceSubType?: string
}
