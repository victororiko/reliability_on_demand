CREATE PROCEDURE dbo.DeleteMetricConfig
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
DELETE FROM RelMetricConfiguration
    WHERE Vertical = @Vertical AND MetricName = @MetricName	/* add search conditions here */
    GO
GO
