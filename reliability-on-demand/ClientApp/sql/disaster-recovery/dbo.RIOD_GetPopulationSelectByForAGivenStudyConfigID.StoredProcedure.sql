/****** Object:  StoredProcedure [dbo].[RIOD_GetPopulationSelectByForAGivenStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetPopulationSelectByForAGivenStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetPopulationSelectByForAGivenStudyConfigID] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetPopulationSelectByForAGivenStudyConfigID]
-- add more stored procedure parameters here
	@StudyConfigID /*parameter name*/ int /*datatype*/
AS
-- body of the stored procedure
 SELECT DISTINCT','+info.PivotName
  FROM RELStudyPivotConfig AS config
  INNER JOIN RELPivotInfo AS info
  ON config.PivotKey = info.PivotKey
  INNER JOIN RELPivotSourceMap AS map
  ON info.PivotSource = map.PivotSource
  WHERE map.PivotSourceType LIKE 'Population%' AND config.StudyConfigID = @StudyConfigID
GO
