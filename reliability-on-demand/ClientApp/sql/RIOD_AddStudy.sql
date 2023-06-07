-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_AddStudy]
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