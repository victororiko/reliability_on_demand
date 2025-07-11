/****** Object:  StoredProcedure [dbo].[RIOD_AddStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_AddStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_AddStudy] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_AddStudy]
    @StudyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no StudyName provided' /*default value*/,
    @LastRefreshDate /*parameter name*/ datetime /*datatype*/,
    @CacheFrequency /*parameter name*/ int /*datatype*/ = 0 /*default value*/,
    @Expiry /*parameter name*/ datetime /*datatype*/,
    @TeamId /*parameter name*/ int /*datatype*/,
    @ObservationWindowDays /*parameter name*/ int /*datatype*/ = 14,
	@StudyType /*parameter name*/ nvarchar(255) /*datatype*/ = 'OS' /*default value*/
/*default value*/
-- add more stored procedure parameters here
AS
-- get team hash string
DECLARE @TeamHashString VARCHAR(255);
SELECT @TeamHashString = HashString FROM RELTeamConfig
WHERE TeamID = @TeamId;
-- add to StudyConfig
INSERT INTO [dbo].[RELStudyConfig]
    (
    StudyName,
    LastRefreshDate,
    CacheFrequency,
    Expiry,
    TeamID,
    ObservationWindowDays,
    HashString,
	StudyType
    )
VALUES
    (
        @StudyName,
        @LastRefreshDate,
        @CacheFrequency,
        @Expiry,
        @TeamId,
        @ObservationWindowDays, 
        CONCAT(@TeamHashString,'_',@StudyName),
		@StudyType
    )
GO
