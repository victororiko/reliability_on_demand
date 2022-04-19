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
    @LastModifiedDate /*parameter name*/ datetime /*datatype*/,
    @CacheFrequency /*parameter name*/ int /*datatype*/ = 0 /*default value*/,
    @Expiry /*parameter name*/ datetime /*datatype*/,
    @TeamId /*parameter name*/ int /*datatype*/,
    @ObservationWindowDays /*parameter name*/ int /*datatype*/ = 14
/*default value*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
INSERT INTO [dbo].[RELStudyConfig]
VALUES
    (@StudyName, @LastModifiedDate, @CacheFrequency, @Expiry, @TeamId, @ObservationWindowDays)
GO

-- example to execute the stored procedure we just created
EXEC dbo.AddStudy 
    @StudyName = 'Added by calling Stored Proc New',
    @LastModifiedDate = '10/10/2021 10:34 AM',
    @CacheFrequency = 12,
	@Expiry = '01/02/2025 10:34 AM',
    @TeamId = 3,
    @ObservationWindowDays = 14 
GO



