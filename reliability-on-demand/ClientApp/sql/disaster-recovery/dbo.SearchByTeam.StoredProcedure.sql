/****** Object:  StoredProcedure [dbo].[SearchByTeam]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SearchByTeam]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[SearchByTeam] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[SearchByTeam]
@TeamID /*parameter name*/ bigint /*datatype_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM [dbo].[RELStudyConfig] AS studies
INNER JOIN [dbo].[RELStudyPivotConfig] AS StudyPivotConfig 
ON studies.StudyConfigID = StudyPivotConfig.StudyConfigID
INNER JOIN [dbo].[RELPivotScope] AS RELPivotScope
ON StudyPivotConfig.PivotScopeID = RELPivotScope.PivotScopeID
WHERE TeamID = @TeamID
FOR JSON AUTO, Include_Null_Values
GO
