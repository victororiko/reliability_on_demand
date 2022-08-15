/****** Object:  StoredProcedure [dbo].[AddFilterPivotsAndValuesToFailureCurve]    Script Date: 8/12/2022 12:58:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[AddFilterPivotsAndValuesToFailureCurve]
	@PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/,
	@IsSelectPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsKeyPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionJoinPivot /*parameter name*/ bit /*datatype*/ = null  /*default value*/,
	@PivotSourceSubType /*parameter name*/ nvarchar(150) /*datatype*/ = ''  /*default value*/,
	@PivotSopeOperator /*parameter name*/ varchar(5) /*datatype*/ = ''  /*default value*/,
	@AggregateBy /*parameter name*/ bit /*datatype*/ = 0  /*default value*/,
	@PivotExpression /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELStudyPivotConfig(PivotScopeID,StudyConfigID,PivotKey,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType,PivotScopeOperator,AggregateBy,PivotExpression) 
	VALUES(@PivotScopeID,@StudyConfigID,@PivotKey,@IsSelectPivot,@IsApportionPivot,@IsKeyPivot,@IsApportionJoinPivot,@PivotSourceSubType,@PivotSopeOperator,@AggregateBy,@PivotExpression)
GO


