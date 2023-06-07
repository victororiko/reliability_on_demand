


-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetAdminConfiguredPivotsData]
	@source /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	WITH configuredData AS(
    SELECT info.PivotKey,info.PivotName,info.ADLDataType,info.UIInputDataType AS UIDataType
	,config.IsApportionColumn,config.IsApportionJoinColumn,config.IsKeyColumn,config.IsSelectColumn,config.AggregateBy
	,config.PivotExpression,config.StudyConfigID,config.PivotScopeID, config.PivotScopeOperator
	,scope.PivotOperator,scope.PivotScopeValue
	FROM RELStudyPivotConfig AS config INNER JOIN RELPivotInfo AS info
	ON config.PivotKey = info.PivotKey
	LEFT OUTER JOIN RELPivotScope AS scope
	ON scope.PivotScopeID = config.PivotScopeID
	WHERE info.PivotSource = @source and config.StudyConfigID = -1)
	SELECT * FROM configuredData FOR JSON AUTO, Include_Null_Values
