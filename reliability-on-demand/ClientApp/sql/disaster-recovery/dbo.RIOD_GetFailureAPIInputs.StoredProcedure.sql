/****** Object:  StoredProcedure [dbo].[RIOD_GetFailureAPIInputs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetFailureAPIInputs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetFailureAPIInputs] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetFailureAPIInputs]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT config.StudyConfigID,config.PivotExpression,config.PivotKey,
infomap.PivotSourceViewPath,infomap.PivotSourceType,info.UIInputDataType AS UIDataType,
failureVert.PivotSourceSubType,failureVert.FailureEventNameList,failureVert.FailureFeederIgnored,failureVert.VerticalFilterExpression,
info.PivotSourceColumnName,
config.IsSelectColumn,config.IsApportionColumn,config.IsApportionJoinColumn,config.IsKeyColumn,
scope.PivotScopeID,config.PivotScopeOperator AS RelationalOperator,scope.PivotScopeValue,scope.PivotOperator,
st.FailureJoinKeyExpressionCols
FROM RELPivotInfo AS info 
INNER JOIN RELPivotSourceMap AS infomap ON info.PivotSource = infomap.PivotSource 
INNER JOIN RELStudyPivotConfig AS config ON info.PivotKey = config.PivotKey
INNER JOIN RELStudyConfig AS sc ON config.StudyConfigID = sc.StudyConfigID
INNER JOIN RELStudyType AS st ON sc.StudyType = st.StudyType
LEFT OUTER JOIN RELPivotScope AS scope ON scope.PivotScopeID = config.PivotScopeID 
INNER JOIN RELFailureVerticalConfig AS failureConfig ON failureConfig.StudyConfigID = config.StudyConfigID 
INNER JOIN RELFailureVertical AS failureVert ON failureVert.VerticalName = failureConfig.VerticalName AND config.PivotSourceSubType = failureVert.PivotSourceSubType
WHERE (config.IsSelectColumn = 1 OR config.IsApportionColumn = 1 OR config.IsKeyColumn = 1 OR config.IsApportionJoinColumn = 1 OR scope.PivotScopeID !=-1) AND (infomap.PivotSourceType LIKE 'Failure%') AND config.StudyConfigID!=-1 ORDER BY StudyConfigID, PivotSourceSubType, PivotScopeOperator desc

GO
