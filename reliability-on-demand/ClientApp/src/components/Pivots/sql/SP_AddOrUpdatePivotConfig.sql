-- Create a new stored procedure called 'AddOrUpdatePivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddOrUpdatePivotConfig'
)
DROP PROCEDURE dbo.AddOrUpdatePivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddOrUpdatePivotConfig
    @StudyID /*parameter name*/ int /*datatype*/,
    @PivotID /*parameter name*/ int /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/,
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'AllMode'/*default value*/
-- Update more stored procedure parameters here
AS
IF EXISTS(
    -- Select rows from a Table or View 'RELStudyPivotConfig' in schema 'dbo'
    SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotId = @PivotID	/* add search conditions here */
)
-- Update existing pivot config
EXECUTE dbo.UpdatePivotConfig 
        @StudyID,
        @PivotID,
        @AggregateBy,
        @PivotSourceSubType
-- Else Add the new pivot config
ELSE EXECUTE dbo.AddPivotConfig 
        @StudyID,
        @PivotID,
        @AggregateBy,
        @PivotSourceSubType
GO

-- example to execute the stored procedure with cleanup 
-- (comment out if necessary)
DECLARE @TestStudyID AS INT = 16 ;
DECLARE @TestPivotID AS INT = 148;
EXECUTE dbo.AddOrUpdatePivotConfig 
    @StudyID = @TestStudyID,
    @PivotID = @TestPivotID,
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
;
-- check if the pivot is Updated 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotID = @TestPivotID
-- clean up: delete newly added test pivot
-- Delete rows from table 'RELStudyPivotConfig'
DELETE FROM RELStudyPivotConfig
WHERE PivotID = @TestPivotID	
-- check if the pivot is Deleted
SELECT *
FROM RELStudyPivotConfig
WHERE PivotID = @TestPivotID
GO
