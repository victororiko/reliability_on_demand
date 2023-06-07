










CREATE PROCEDURE [dbo].[RIOD_GetFilterExpressionForPivotScopeIds]
    @PivotScopeId /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
DECLARE @StudyConfigIDtoUse INT;
-- get previously configured user configs if they exixts
IF EXISTS(
    SELECT *
FROM RELStudyPivotConfig
WHERE PivotScopeID LIKE @PivotScopeId and StudyConfigID = @StudyConfigID
)
SET @StudyConfigIDtoUse = @StudyConfigID
ELSE SET @StudyConfigIDtoUse = -1

SELECT * FROM
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
	WHERE scope.PivotScopeID = @PivotScopeId AND config.StudyConfigID = @StudyConfigIDtoUse
) AS ans FOR JSON AUTO, Include_Null_Values
