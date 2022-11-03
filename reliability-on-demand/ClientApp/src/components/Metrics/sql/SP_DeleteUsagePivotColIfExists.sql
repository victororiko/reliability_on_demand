-- Create a new stored procedure called 'DeleteUsagePivotColIfExists' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
    SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
    WHERE SPECIFIC_SCHEMA = N'dbo'
        AND SPECIFIC_NAME = N'DeleteUsagePivotColIfExists'
) DROP PROCEDURE dbo.DeleteUsagePivotColIfExists
GO -- Create the stored procedure in the specified schema
    CREATE PROCEDURE dbo.DeleteUsagePivotColIfExists 
    @PivotKey varchar(255) = null,
    @PivotScopeID int = -1,
    @StudyConfigID int = -1 AS -- body of the stored procedure
    IF EXISTS(
        SELECT PivotKey,
            PivotScopeID,
            StudyConfigID
        FROM dbo.RELStudyPivotConfig
        WHERE PivotKey = @PivotKey
            AND StudyConfigID = @StudyConfigID
            AND PivotScopeID = @PivotScopeID
    ) -- check if this row alrady exists
    -- Delete it
    DELETE FROM RELStudyPivotConfig
    WHERE StudyConfigID = @StudyConfigID 
        AND PivotKey = @PivotKey
        AND PivotScopeID = @PivotScopeID;
GO -- example to execute the stored procedure we just created
-- add a test pivot
    EXECUTE dbo.AddUsagePivotColIfMissing @PivotKey = 'AggregatedAppUsageMetricsHourly.ss_InteractivityDurationMS',
    @PivotScopeID = -1,
    @StudyConfigID = 1
GO
-- delete it using stored proc
    EXECUTE dbo.DeleteUsagePivotColIfExists @PivotKey = 'AggregatedAppUsageMetricsHourly.ss_InteractivityDurationMS',
    @PivotScopeID = -1,
    @StudyConfigID = 1
GO