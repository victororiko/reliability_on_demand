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
    @StudyConfigID int,
    @PivotKey varchar(255),
    @AggregateBy bit,
    @PivotSourceSubType nvarchar(255)  = 'no PivotSourceSubType provided',
    @PivotScopeOperator varchar(5) = '',
    @PivotScopeID int = -1
AS
-- add to RELStudyPivotConfig table
INSERT INTO [dbo].[RELStudyPivotConfig]
    (
    StudyConfigID,
    PivotKey,
    AggregateBy,
    PivotSourceSubType,
    PivotScopeOperator,
    PivotScopeID
    )
VALUES
    (
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
    )
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.AddPivotConfig 
    @StudyConfigID = 1,
    @PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule',
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
GO
-- check if the pivot is added 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule' AND StudyConfigID = 1	 
GO
-- Cleanup: delete recently added pivot
DELETE FROM RELStudyPivotConfig
WHERE PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule' AND StudyConfigID = 1	
GO
-- check if the pivot is deleted
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule' AND StudyConfigID = 1	 
GO 