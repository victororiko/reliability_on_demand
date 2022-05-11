-- UPDATE Metric Configs ---

-- Create a new stored procedure called 'UpdateMetricConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *

FROM INFORMATION_SCHEMA
.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'UpdateMetricConfig'
)
DROP PROCEDURE dbo.UpdateMetricConfig
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.UpdateMetricConfig
    @UniqueKey               varchar(255),
    @MetricName              varchar(255),
    @Vertical                varchar(255),
    @MinUsageInMS            bigint,
    @FailureRateInHour       float,
    @HighUsageMinInMS        bigint,
    @MetricGoal              float,
    @StudyId                 int,
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
        StudyId = @StudyId,
        MetricGoalAspirational = @MetricGoalAspirational,
        IsUsage = @IsUsage
    WHERE UniqueKey = @UniqueKey
    GO
GO
