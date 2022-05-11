-- Create a new stored procedure called 'AddMetricConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA
.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddMetricConfig'
)
DROP PROCEDURE dbo.AddMetricConfig
GO

-- Create the stored procedure in the specified schema
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
    @StudyId /*parameter name*/ int /*datatype*/ = -1,
    /*default_value*/
    @MetricGoalAspirational /*parameter name*/ float /*datatype*/ = null,
    /*default_value*/
    @IsUsage /*parameter name*/ bit /*datatype*/ = 1
/*default_value*/
AS
-- body of the stored procedure
-- Insert rows into table 'dbo.RELMetricConfiguration'
INSERT INTO dbo.RELMetricConfiguration
    ( -- columns to insert data into
    MetricName,
    Vertical,
    MinUsageInMS,
    FailureRateInHour,
    HighUsageMinInMS,
    MetricGoal,
    StudyId,
    MetricGoalAspirational,
    IsUsage
    )
VALUES
    ( -- first row: values for the columns in the list above
        @MetricName,
        @Vertical,
        @MinUsageInMS,
        @FailureRateInHour,
        @HighUsageMinInMS,
        @MetricGoal,
        @StudyId,
        @MetricGoalAspirational,
        @IsUsage
    )
    GO
GO