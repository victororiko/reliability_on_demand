/****** Object:  StoredProcedure [dbo].[RIOD_GetAdminConfiguredPivotsData]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetAdminConfiguredPivotsData]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetAdminConfiguredPivotsData] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetAdminConfiguredPivotsData]
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
GO
