CREATE PROCEDURE dbo.AddMetricConfig
    @MetricName /*parameter name*/ varchar(255) /*datatype*/ = 'no metric name provided',
    /*default_value*/
    @Vertical /*parameter name*/ varchar(255) /*datatype*/ = 'no vertical provided',
    /*default_value*/
    @MinUsageInMS /*parameter name*/ bigint /*datatype*/ = null,
    /*default_value*/
    @FailureRateInHour /*parameter name*/ float /*datatype*/ = null,
    /*default_value*/
    @HighUsageMinInMS /*parameter name*/ bigint /*datatype*/ = null,
    /*default_value*/
    @MetricGoal /*parameter name*/ float /*datatype*/ = null,
    /*default_value*/
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1,
    /*default_value*/
    @MetricGoalAspirational /*parameter name*/ float /*datatype*/ = null,
    /*default_value*/
    @IsUsage /*parameter name*/ bit /*datatype*/ = 1
/*default_value*/
AS
-- get Study hash string
DECLARE @FailureVerticalHashString VARCHAR(255);
    SELECT @FailureVerticalHashString = HashString 
    FROM RELFailureVerticalConfig
    WHERE StudyConfigID = @StudyConfigID AND VerticalName = @Vertical;

-- Insert rows into table 'dbo.RELMetricConfiguration'
INSERT INTO dbo.RELMetricConfiguration
    ( -- columns to insert data into
    MetricName,
    Vertical,
    MinUsageInMS,
    FailureRateInHour,
    HighUsageMinInMS,
    MetricGoal,
    StudyConfigID,
    MetricGoalAspirational,
    IsUsage,
    HashString
    )
VALUES
    ( -- first row: values for the columns in the list above
        @MetricName,
        @Vertical,
        @MinUsageInMS,
        @FailureRateInHour,
        @HighUsageMinInMS,
        @MetricGoal,
        @StudyConfigID,
        @MetricGoalAspirational,
        @IsUsage,
        CONCAT(@FailureVerticalHashString,'_',@MetricName)
    )
    GO
GO