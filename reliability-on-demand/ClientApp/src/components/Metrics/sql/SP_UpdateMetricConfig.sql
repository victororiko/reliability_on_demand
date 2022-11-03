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
    @UniqueKey               varchar(255),
    @MetricName              varchar(255),
    @Vertical                varchar(255),
    @MinUsageInMS            bigint,
    @FailureRateInHour       float,
    @HighUsageMinInMS        bigint,
    @MetricGoal              float,
    @StudyConfigID           int,
    @MetricGoalAspirational  float,
    @IsUsage                 bit,
    @PivotKey                varchar(255) = null
AS
-- body of the stored procedure
DECLARE @OldPivotKey AS varchar(255) = ''
select @OldPivotKey = (
    select PivotKey 
    from RelMetricConfiguration
    where UniqueKey = @UniqueKey);
select @OldPivotKey;
-- first update the associated row in RELStudyPivotConfig table
UPDATE dbo.RELStudyPivotConfig
SET PivotKey = @PivotKey
WHERE StudyConfigID = @StudyConfigID and PivotScopeID = -1 and PivotKey = @OldPivotKey;
-- execute update
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
        IsUsage = @IsUsage,
        PivotKey = @PivotKey
    WHERE UniqueKey = @UniqueKey
    GO
GO
