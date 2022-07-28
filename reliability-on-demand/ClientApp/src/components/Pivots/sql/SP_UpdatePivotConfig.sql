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
    @StudyConfigID int,
    @PivotKey varchar(255),
    @AggregateBy bit,
    @PivotSourceSubType nvarchar(255) = 'no PivotSourceSubType provided',
    @PivotScopeOperator varchar(5) = '',
    @PivotScopeID int = -1
AS
-- Update to RELStudyPivotConfig
UPDATE RELStudyPivotConfig 
SET 
    AggregateBy = @AggregateBy,
    PivotScopeID = @PivotScopeID,
    PivotScopeOperator = @PivotScopeOperator
    WHERE StudyConfigID = @StudyConfigID
    AND PivotKey = @PivotKey
    AND PivotSourceSubType = @PivotSourceSubType
GO
GO

-- example to execute the stored procedure we just created
-- BEFORE
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule'
GO
-- update
EXECUTE dbo.UpdatePivotConfig 
    @StudyConfigID = -1,
    @PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule',
    @AggregateBy = 0,
    @PivotSourceSubType = 'AllMode',
    @PivotScopeOperator = 'AND'
GO
-- AFTER
SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule'
GO
-- Cleanup
DELETE FROM RELStudyPivotConfig
WHERE StudyConfigID = -1 AND PivotKey = 'DeviceCensusConsolidated.ss_CleanupRule'
GO