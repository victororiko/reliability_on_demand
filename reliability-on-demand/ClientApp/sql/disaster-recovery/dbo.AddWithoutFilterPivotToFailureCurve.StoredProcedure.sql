/****** Object:  StoredProcedure [dbo].[AddWithoutFilterPivotToFailureCurve]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddWithoutFilterPivotToFailureCurve]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[AddWithoutFilterPivotToFailureCurve] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[AddWithoutFilterPivotToFailureCurve]
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
GO
