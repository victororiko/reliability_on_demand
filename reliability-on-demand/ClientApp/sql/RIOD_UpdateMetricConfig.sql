-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_UpdateMetricConfig
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
