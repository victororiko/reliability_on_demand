export interface PivotSource {
  PivotSource: string
  PivotSourcePath: string
  PivotSourceType: string
  PivotSourceViewPath: string
}

export interface UserPivotConfig {
  RelationID:            number;
  PivotScopeID:          null;
  StudyID:               number;
  PivotID:               number;
  AggregateBy:           boolean;
  IsSelectColumn:        null;
  IsApportionColumn:     null;
  IsKeyColumn:           null;
  IsApportionJoinColumn: null;
  JoinPivotExpression:   null;
  JoinPivotOp:           null;
  IsPrimaryPivot:        null;
  PivotSourceSubType:    string;
  PivotExpression:       null;
  "dbo.RELPivotInfo":    DboRELPivotInfo[];
}

export interface DboRELPivotInfo {
  PivotName:          string;
  PivotSourceSubType: string;
  PivotKey:           string;
}
