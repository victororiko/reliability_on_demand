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
    @StudyConfigID /*parameter name*/ int /*datatype*/,
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/, 
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'no PivotSourceSubType provided' /*default value*/
/*default value*/
-- add more stored procedure parameters here
AS
-- add to StudyPivotConfig
INSERT INTO [dbo].[RELStudyPivotConfig]
    (
        StudyConfigID, 
        PivotKey, 
        AggregateBy,
        PivotSourceSubType
    )
VALUES
    (
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType
    )
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
-- Cleanup: delete recently added pivot
DELETE FROM RELStudyPivotConfig
WHERE PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId' AND StudyConfigID = 1	
GO
-- check if the pivot is deleted
SELECT * FROM RELStudyPivotConfig
WHERE PivotKey = 'WatsonSnapshotAggViewUserMode.ss_globalDeviceId' AND StudyConfigID = 1	 
GO 