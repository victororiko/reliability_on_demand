/****** Object:  StoredProcedure [dbo].[GetUsageAggregateByForAGivenStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetUsageAggregateByForAGivenStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetUsageAggregateByForAGivenStudyConfigID] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetUsageAggregateByForAGivenStudyConfigID]
-- add more stored procedure parameters here
	@StudyConfigID /*parameter name*/ int /*datatype*/
AS
-- body of the stored procedure
SELECT DISTINCT','+TargetPivotName FROM
(SELECT 
 config.StudyConfigID,
 targetInfo.PivotName AS TargetPivotName, 
 config.AggregateBy
 FROM RELStudyPivotConfig AS config 
 INNER JOIN RELPivotInfo AS info ON config.PivotKey = info.PivotKey 
 INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource
 LEFT OUTER JOIN RELPivotSourceColumnNameMap AS colmap ON colmap.FromPivotKey = config.PivotKey
 LEFT OUTER JOIN  RELPivotInfo AS targetInfo ON colmap.ToPivotKey = targetInfo.PivotKey
 LEFT OUTER JOIN RELPivotScope AS scope ON config.PivotScopeID = scope.PivotScopeID
WHERE (map.PivotSourceType LIKE '%Population%' AND AggregateBy = 1 AND targetInfo.PivotName is not null)
AND config.StudyConfigID =@StudyConfigID) AS ans
GO
