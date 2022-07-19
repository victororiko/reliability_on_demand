-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.UpdateMetricConfig
    @UniqueKey               varchar(255),
    @MetricName              varchar(255),
    @Vertical                varchar(255),
    @MinUsageInMS            bigint,
    @FailureRateInHour       float,
    @HighUsageMinInMS        bigint,
    @MetricGoal              float,
    @StudyConfigID                 int,
    @MetricGoalAspirational  float,
    @IsUsage                 bit

AS
-- body of the stored procedure
UPDATE dbo.RELMetricConfiguration
    SET     -- columns to insert data into
        MetricName = @MetricName,
        Vertical = @Vertical,
        MinUsageInMS = @MinUsageInMS,
        FailureRateInHour = @FailureRateInHour,
        HighUsageMinInMS = @HighUsageMinInMS,
        MetricGoal = @MetricGoal,
        StudyConfigID = @StudyConfigID,
        MetricGoalAspirational = @MetricGoalAspirational,
        IsUsage = @IsUsage
    WHERE UniqueKey = @UniqueKey
    GO
GO
