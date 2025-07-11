/****** Object:  StoredProcedure [dbo].[RIOD_GetAllStudyConfigsForTeam]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetAllStudyConfigsForTeam]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetAllStudyConfigsForTeam] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetAllStudyConfigsForTeam]
    @TeamID /*parameter name*/ int /*datatype_for_TeamID*/ = 0 /*default_value_for_TeamID*/
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT * FROM (
    SELECT config.StudyConfigID,
	config.StudyName,
	config.LastRefreshDate,
	config.CacheFrequency,
	config.Expiry,
	config.TeamID,config.ObservationWindowDays,
	config.HashString,
	config.StudyType,
	stype.FailureJoinKeyExpressionCols,
	stype.UsageJoinKeyExpressionCols,
	stype.PopulationJoinKeyExpressionCols
    FROM dbo.RELStudyConfig as config
	INNER JOIN RELStudyType AS stype
	ON config.StudyType = stype.StudyType
    WHERE TeamID = @TeamID) AS ans
    FOR JSON AUTO, Include_Null_Values
GO
