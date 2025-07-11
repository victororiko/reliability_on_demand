/****** Object:  StoredProcedure [dbo].[AddMetricConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddMetricConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[AddMetricConfig] AS' 
END
GO
    ALTER PROCEDURE [dbo].[AddMetricConfig] @MetricName varchar(255) = 'no metric name provided',
    @Vertical varchar(255) = 'no vertical provided',
    @MinUsageInMS bigint = null,
    @FailureRateInHour float = null,
    @HighUsageMinInMS bigint = null,
    @MetricGoal float = null,
    @StudyConfigID int = -1,
    @MetricGoalAspirational float = null,
    @IsUsage bit = 1,
    @PivotKey varchar(255) = null,
    @PivotScopeID int = -1 
AS -- Add usage pivot in RELStudyPivotConfig first 
    -- EXECUTE dbo.AddUsagePivotColIfMissing 
    --     @PivotKey = @PivotKey,
    --     @PivotScopeID = @PivotScopeID,
    --     @StudyConfigID = @StudyConfigID;
-- get Study hash string
DECLARE @FailureVerticalHashString VARCHAR(255);
SELECT
    @FailureVerticalHashString = HashString
FROM
    RELFailureVerticalConfig
WHERE
    StudyConfigID = @StudyConfigID
    AND VerticalName = @Vertical;
-- Insert rows into table 'dbo.RELMetricConfig'
INSERT INTO
    dbo.RELMetricConfig (
        -- columns to insert data into
        MetricName,
        Vertical,
        MinUsageInMS,
        FailureRateInHour,
        HighUsageMinInMS,
        MetricGoal,
        StudyConfigID,
        MetricGoalAspirational,
        IsUsage,
        HashString,
        PivotKey,
        PivotScopeID -- -1 added by default
    )
VALUES
    (
        -- first row: values for the columns in the list above
        @MetricName,
        @Vertical,
        @MinUsageInMS,
        @FailureRateInHour,
        @HighUsageMinInMS,
        @MetricGoal,
        @StudyConfigID,
        @MetricGoalAspirational,
        @IsUsage,
        CONCAT(@FailureVerticalHashString, '_', @MetricName),
        @PivotKey,
        @PivotScopeID -- -1 added by default
    )
GO
