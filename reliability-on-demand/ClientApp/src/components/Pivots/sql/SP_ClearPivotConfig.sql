-- Create a new stored procedure called 'ClearPivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'ClearPivotConfig'
)
DROP PROCEDURE dbo.ClearPivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.ClearPivotConfig
    @StudyConfigID /*parameter name*/ int /*datatype*/,
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/
-- add more stored procedure parameters here
AS
    -- Delete rows from table 'RELStudyPivotConfig'
    DELETE FROM RELStudyPivotConfig
    WHERE StudyConfigID = @StudyConfigID AND PivotKey = @PivotKey
    GO
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.AddPivotConfig 
    @StudyConfigID = 1,
    @PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId',
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
GO

-- check if the pivot is added 
SELECT * FROM RELStudyPivotConfig
WHERE PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId' AND StudyConfigID = 1	 
GO 
-- delete newly added pivot config
EXECUTE dbo.ClearPivotConfig
    @StudyConfigID = 1,
    @PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId'
GO
-- check if the pivot is deleted
SELECT * FROM RELStudyPivotConfig
WHERE PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId' AND StudyConfigID = 1	 
GO 