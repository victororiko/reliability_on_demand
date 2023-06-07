

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_AddWithoutFilterPivotToFailureCurve]
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/,
	@IsSelectPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsKeyPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionJoinPivot /*parameter name*/ bit /*datatype*/ = null  /*default value*/,
	@PivotSourceSubType /*parameter name*/ varchar(150) /*datatype*/ = ''  /*default value*/,
	@AggregateBy /*parameter name*/ bit /*datatype*/ = null  /*default value*/,
	@PivotExpression /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELStudyPivotConfig(StudyConfigID,PivotKey,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType,PivotScopeID,PivotScopeOperator,AggregateBy,PivotExpression) 
	VALUES(@StudyConfigID,@PivotKey,@IsSelectPivot,@IsApportionPivot,@IsKeyPivot,@IsApportionJoinPivot,@PivotSourceSubType,-1,'',@AggregateBy,@PivotExpression)
