/****** Object:  StoredProcedure [dbo].[RIOD_GetUsageAPIInputs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetUsageAPIInputs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetUsageAPIInputs] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetUsageAPIInputs]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM
(SELECT res.*, st.UsageJoinKeyExpressionCols FROM
(SELECT * 
FROM
(SELECT 
 config.StudyConfigID,
 targetInfo.PivotName AS TargetPivotName, 
 config.AggregateBy,
 '' AS PivotScopeOperator,
 0 AS IsUsagePivot,
 '' AS PivotOperator,
 '' AS PivotScopeValue,
 null AS PivotScopeID,
 map.PivotSourceViewPath,
 '' AS PivotName,
 info.PivotKey
 FROM RELStudyPivotConfig AS config 
 INNER JOIN RELPivotInfo AS info ON config.PivotKey = info.PivotKey 
 INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource
 LEFT OUTER JOIN RELPivotSourceColumnNameMap AS colmap ON colmap.FromPivotKey = config.PivotKey
 LEFT OUTER JOIN  RELPivotInfo AS targetInfo ON colmap.ToPivotKey = targetInfo.PivotKey
 LEFT OUTER JOIN RELPivotScope AS scope ON config.PivotScopeID = scope.PivotScopeID
WHERE (map.PivotSourceType LIKE '%Population%' AND AggregateBy = 1 AND targetInfo.PivotName is not null)
AND config.StudyConfigID != -1
) AS agg
Union (SELECT 
 metric.StudyConfigID,
 '' AS TargetPivotName,
 '' AS AggregateBy,
 '' AS PivotScopeOperator, 
 metric.IsUsage AS IsUsagePivot, 
 scope.PivotOperator, 
 scope.PivotScopeValue,
 metric.PivotScopeID,
 map.PivotSourceViewPath,
 info.PivotName,
 info.PivotKey
 FROM RELMetricConfig AS metric 
 INNER JOIN RELPivotInfo AS info ON metric.PivotKey = info.PivotKey 
 INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource
 LEFT OUTER JOIN RELPivotSourceColumnNameMap AS colmap ON colmap.FromPivotKey = metric.PivotKey
 LEFT OUTER JOIN  RELPivotInfo AS targetInfo ON colmap.ToPivotKey = targetInfo.PivotKey
 LEFT OUTER JOIN RELPivotScope AS scope ON metric.PivotScopeID = scope.PivotScopeID
WHERE ((map.PivotSourceType LIKE '%Usage%' AND (metric.IsUsage = 1 OR metric.PivotScopeID != -1)) AND metric.StudyConfigID != -1)) 
) AS res
INNER JOIN
RELStudyConfig AS sc ON res.StudyConfigID = sc.StudyConfigID
INNER JOIN
RELStudyType AS st ON sc.StudyType = st.StudyType) AS ans
GO
