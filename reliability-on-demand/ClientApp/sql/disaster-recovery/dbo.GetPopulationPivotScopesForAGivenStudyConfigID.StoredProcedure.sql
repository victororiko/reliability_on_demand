/****** Object:  StoredProcedure [dbo].[GetPopulationPivotScopesForAGivenStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetPopulationPivotScopesForAGivenStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetPopulationPivotScopesForAGivenStudyConfigID] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetPopulationPivotScopesForAGivenStudyConfigID]
-- add more stored procedure parameters here
	@StudyConfigID /*parameter name*/ int /*datatype*/
AS
-- body of the stored procedure
  SELECT info.UIInputDataType AS UIInputDataType
  ,info.PivotKey
  ,config.PivotScopeOperator AS RelationalOperator
  , scope.PivotOperator
  ,scope.PivotScopeValue
  FROM RELStudyPivotConfig AS config
  INNER JOIN RELPivotInfo AS info
  ON config.PivotKey = info.PivotKey
  INNER JOIN RELPivotSourceMap AS map
  ON info.PivotSource = map.PivotSource
  LEFT OUTER JOIN RELPivotScope AS scope
  ON config.PivotScopeID = scope.PivotScopeID
  WHERE config.PivotScopeID!=-1 AND map.PivotSourceType LIKE 'Population%' AND config.StudyConfigID = @StudyConfigID
  ORDER BY config.PivotScopeOperator desc
GO
