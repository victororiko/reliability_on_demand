IF EXISTS (
    SELECT
        *
    FROM
        INFORMATION_SCHEMA.ROUTINES
    WHERE
        SPECIFIC_SCHEMA = N'dbo'
        AND SPECIFIC_NAME = N'DeleteMetricConfig'
) DROP PROCEDURE dbo.DeleteMetricConfig
GO
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
    @IsUsage                 bit,
    @PivotKey varchar(255) = null,
    @PivotScopeID int = -1 
AS
-- body of the stored procedure
    -- delete from Metric table
    DELETE FROM RELMetricConfig
    WHERE 
    UniqueKey = @UniqueKey 
GO
