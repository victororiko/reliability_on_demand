-- Create a new stored procedure called 'UpdatePivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'UpdatePivotConfig'
)
DROP PROCEDURE dbo.UpdatePivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.UpdatePivotConfig
    @StudyID /*parameter name*/ int /*datatype*/,
    @PivotID /*parameter name*/ int /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/,
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'no PivotSourceSubType provided'/*default value*/
-- Update more stored procedure parameters here
AS
-- Update to StudyPivotConfig
UPDATE RELStudyPivotConfig 
SET 
    AggregateBy = @AggregateBy
    WHERE StudyID = @StudyID AND PivotID = @PivotID AND PivotSourceSubType = @PivotSourceSubType 
GO
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.UpdatePivotConfig 
    @StudyID = 1,
    @PivotID = 150,
    @AggregateBy = NULL ,
    @PivotSourceSubType = 'AllMode'
GO
-- check if the pivot is Updated 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotID = 150
GO
-- get pivot info
SELECT *
FROM RELPivotInfo
WHERE PivotID = 150
GO
