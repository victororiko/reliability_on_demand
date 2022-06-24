-- Create a new stored procedure called 'AddPivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddPivotConfig'
)
DROP PROCEDURE dbo.AddPivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddPivotConfig
    @StudyID /*parameter name*/ int /*datatype*/,
    @PivotID /*parameter name*/ int /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/, 
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'no PivotSourceSubType provided' /*default value*/
/*default value*/
-- add more stored procedure parameters here
AS
-- add to StudyPivotConfig
INSERT INTO [dbo].[RELStudyPivotConfig]
    (
        StudyID, 
        PivotID, 
        AggregateBy,
        PivotSourceSubType
    )
VALUES
    (
        @StudyID,
        @PivotID,
        @AggregateBy,
        @PivotSourceSubType
    )
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.AddPivotConfig 
    @StudyID = 1,
    @PivotID = 150,
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
GO
-- check if the pivot is added 
SELECT * FROM RELStudyPivotConfig
WHERE PivotID = 150 AND StudyID = 1	 
GO 
-- Cleanup: delete recently added pivot
DELETE FROM RELStudyPivotConfig
WHERE PivotID = 150 AND StudyID = 1	
GO
-- check if the pivot is deleted
SELECT * FROM RELStudyPivotConfig
WHERE PivotID = 150 AND StudyID = 1	 
GO 