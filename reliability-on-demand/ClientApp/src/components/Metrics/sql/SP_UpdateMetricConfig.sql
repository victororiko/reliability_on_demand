IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'UpdateMetricConfig'
)
DROP PROCEDURE dbo.UpdateMetricConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.UpdateMetricConfig
    @UniqueKey               [UNIQUEIDENTIFIER],
    @MetricName              varchar(255),
    @Vertical                varchar(255),
    @MinUsageInMS            bigint,
    @FailureRateInHour       float,
    @HighUsageMinInMS        bigint,
    @MetricGoal              float,
    @StudyConfigID           bigint,
    @MetricGoalAspirational  float,
    @IsUsage                 bit,
    @PivotKey                nvarchar(255) = null
AS
-- execute update
UPDATE dbo.RELMetricConfig
    SET     -- columns to update
        MetricName = @MetricName,
        Vertical = @Vertical,
        MinUsageInMS = @MinUsageInMS,
        FailureRateInHour = @FailureRateInHour,
        HighUsageMinInMS = @HighUsageMinInMS,
        MetricGoal = @MetricGoal,
        StudyConfigID = @StudyConfigID,
        MetricGoalAspirational = @MetricGoalAspirational,
        IsUsage = @IsUsage,
        PivotKey = @PivotKey
    WHERE UniqueKey = @UniqueKey
    GO
GO

-- Test
-- EXECUTE UpdateMetricConfig '865EC1AA-339D-ED11-994C-00224822950F', 'Test Metric', 'Test Vertical', 100, 0.1, 100, 0.1, 1, 0.1, 1, 'Test Pivot Key'
-- GO