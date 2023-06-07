CREATE PROCEDURE dbo.RIOD_DeleteMetricConfig
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
    -- AND
    -- MetricName = @MetricName 
    -- AND
    -- Vertical = @Vertical 
    -- AND
    -- MinUsageInMS = @MinUsageInMS 
    -- AND
    -- FailureRateInHour = @FailureRateInHour 
    -- AND
    -- HighUsageMinInMS = @HighUsageMinInMS 
    -- AND
    -- MetricGoal = @MetricGoal 
    -- AND
    -- StudyConfigID = @StudyConfigID 
    -- AND
    -- MetricGoalAspirational = @MetricGoalAspirational 
    -- AND
    -- IsUsage = @IsUsage 
    -- AND
    -- PivotKey = @PivotKey 
    -- AND
    -- PivotScopeID = @PivotScopeID   
    ;
    -- delete usage pivot if it exsits in the RELStudyPivotCofig
    -- EXECUTE dbo.DeleteUsagePivotColIfExists 
    --     @PivotKey = @PivotKey,
    --     @PivotScopeID = @PivotScopeID,
    --     @StudyConfigID = @StudyConfigID
    -- ;
