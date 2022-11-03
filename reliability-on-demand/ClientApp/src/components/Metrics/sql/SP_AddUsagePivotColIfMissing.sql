-- Create a new stored procedure called 'AddUsagePivotColIfMissing' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
    SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
    WHERE SPECIFIC_SCHEMA = N'dbo'
        AND SPECIFIC_NAME = N'AddUsagePivotColIfMissing'
) DROP PROCEDURE dbo.AddUsagePivotColIfMissing
GO -- Create the stored procedure in the specified schema
    CREATE PROCEDURE dbo.AddUsagePivotColIfMissing 
    @PivotKey varchar(255) = null,
    @PivotScopeID int = -1,
    @StudyConfigID int = -1 AS -- body of the stored procedure
    IF NOT EXISTS(
        SELECT PivotKey,
            PivotScopeID,
            StudyConfigID
        FROM dbo.RELStudyPivotConfig
        WHERE PivotKey = @PivotKey
            AND StudyConfigID = @StudyConfigID
            AND PivotScopeID = @PivotScopeID
    ) -- check if this row alrady exists
    -- Add this row only if it doesn't exist
    EXECUTE AddPivotConfig @StudyConfigID = @StudyConfigID,
    @PivotKey = @PivotKey,
    @AggregateBy = 0,
    @PivotSourceSubType = 'AllMode',
    @PivotScopeOperator = '',
    @PivotScopeID = @PivotScopeID;
GO -- example to execute the stored procedure we just created
    EXECUTE dbo.AddUsagePivotColIfMissing @PivotKey = 'AggregatedAppUsageMetricsHourly.ss_InteractivityDurationMS',
    @PivotScopeID = -1,
    @StudyConfigID = 1
GO