/****** Object:  StoredProcedure [dbo].[RIOD_GetDistinctStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetDistinctStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetDistinctStudyConfigID] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetDistinctStudyConfigID]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT * FROM(
SELECT DISTINCT(study.StudyConfigID),study.StudyName,team.HashString FROM RELStudyConfig AS study
INNER JOIN RELTeamConfig AS team
ON study.TeamID = team.TeamID
INNER JOIN RELStudyPivotConfig AS config
ON config.StudyConfigID = study.StudyConfigID
INNER JOIN RELPivotInfo AS info
ON config.PivotKey = info.PivotKey
INNER JOIN RELPivotSourceMap AS sourcemap
ON sourcemap.PivotSource = info.PivotSource
WHERE config.StudyConfigID != -1 AND sourcemap.PivotSourceType LIKE 'Population%') AS ans
GO
