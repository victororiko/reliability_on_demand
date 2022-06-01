-- Create a new stored procedure called 'AddStudy' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddStudy'
)
DROP PROCEDURE dbo.AddStudy
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddStudy
    @StudyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no StudyName provided' /*default value*/,
    @LastRefreshDate /*parameter name*/ datetime /*datatype*/,
    @CacheFrequency /*parameter name*/ int /*datatype*/ = 0 /*default value*/,
    @Expiry /*parameter name*/ datetime /*datatype*/,
    @TeamId /*parameter name*/ int /*datatype*/,
    @ObservationWindowDays /*parameter name*/ int /*datatype*/ = 14
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
    HashString
    )
VALUES
    (
        @StudyName,
        @LastRefreshDate,
        @CacheFrequency,
        @Expiry,
        @TeamId,
        @ObservationWindowDays, 
        CONCAT(@TeamHashString,'_',@StudyName)
    )
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.AddStudy 
    @StudyName = 'Added by calling Stored Proc New',
    @LastRefreshDate = '10/10/2021 10:34 AM',
    @CacheFrequency = 12,
	@Expiry = '01/02/2025 10:34 AM',
    @TeamId = 1,
    @ObservationWindowDays = 14
GO

