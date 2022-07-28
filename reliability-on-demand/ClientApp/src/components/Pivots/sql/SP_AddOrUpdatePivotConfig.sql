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
    @StudyConfigID int,
    @PivotKey varchar(255),
    @AggregateBy bit,
    @PivotSourceSubType nvarchar(255) = 'AllMode',
    @PivotScopeOperator varchar(5) = '',
    @PivotScopeID int = -1
AS
IF EXISTS(
    -- Select rows from a Table or View 'RELStudyPivotConfig' in schema 'dbo'
    SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotKey = @PivotKey 
AND StudyConfigID = @StudyConfigID
AND PivotScopeID = @PivotScopeID
)
-- Update existing pivot config
EXECUTE dbo.UpdatePivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
-- Else Add the new pivot config
ELSE EXECUTE dbo.AddPivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
GO

-- example to execute the stored procedure with cleanup 
-- (comment out if necessary)
DECLARE @TestStudyConfigID AS INT = 16 ;
DECLARE @TestPivotKey AS varchar(255) = 'DeviceCensusConsolidated.ss_CleanupRule';
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
