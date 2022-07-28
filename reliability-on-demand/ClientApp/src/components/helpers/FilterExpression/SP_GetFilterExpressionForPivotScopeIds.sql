/****** Object:  StoredProcedure [dbo].[GetFilterExpressionForPivotScopeIds]    Script Date: 7/27/2022 10:52:12 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetFilterExpressionForPivotScopeIds]
    @PivotScopeId /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	WITH FilterExp
AS
(
    SELECT scope.PivotKey AS PivotKey
	,scope.PivotScopeID AS PivotScopeID
	,scope.PivotOperator AS PivotOperator
	,scope.PivotScopeValue AS PivotScopeValue
	,info.UIInputDataType AS UIDataType
	,config.PivotScopeOperator AS RelationalOperator
	,config.StudyConfigID AS StudyConfigID
	,info.PivotName AS PivotName
	FROM RELPivotScope AS scope
	INNER JOIN RELPivotInfo AS info
	ON scope.PivotKey = info.PivotKey
	INNER JOIN RELStudyPivotConfig AS config
	ON config.PivotScopeID = scope.PivotScopeID
	WHERE scope.PivotScopeID = @PivotScopeId AND config.StudyConfigID = @StudyConfigID
)
SELECT * FROM FilterExp FOR JSON AUTO, Include_Null_Values
GO


