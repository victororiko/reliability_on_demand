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
    @StudyConfigID /*parameter name*/ int /*datatype*/,
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/,
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'AllMode'/*default value*/
-- Update more stored procedure parameters here
AS
IF EXISTS(
    -- Select rows from a Table or View 'RELStudyPivotConfig' in schema 'dbo'
    SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotKey = @PivotKey	/* add search conditions here */
)
-- Update existing pivot config
EXECUTE dbo.UpdatePivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType
-- Else Add the new pivot config
ELSE EXECUTE dbo.AddPivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType
GO

-- example to execute the stored procedure with cleanup 
-- (comment out if necessary)
DECLARE @TestStudyConfigID AS INT = 16 ;
DECLARE @TestPivotKey AS varchar(255) = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId';
-- make sure pivot does not exist 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = @TestPivotKey
-- first time we call this SP it adds the pivot
EXECUTE dbo.AddOrUpdatePivotConfig 
    @StudyConfigID = @TestStudyConfigID,
    @PivotKey = @TestPivotKey,
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
;
-- check if the pivot is Added
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = @TestPivotKey
-- Then we updated it
EXECUTE dbo.AddOrUpdatePivotConfig 
    @StudyConfigID = @TestStudyConfigID,
    @PivotKey = @TestPivotKey,
    @AggregateBy = 0 ,
    @PivotSourceSubType = 'AllMode'
;
-- make sure pivot gets updated 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = @TestPivotKey
-- clean up: delete newly added test pivot
-- Delete rows from table 'RELStudyPivotConfig'
DELETE FROM RELStudyPivotConfig
WHERE PivotKey = @TestPivotKey	
-- check if the pivot is Deleted
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = @TestPivotKey
GO
