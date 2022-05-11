-- Delete Metric Configs ---

-- Create a new stored procedure called 'DeleteMetricConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *

FROM INFORMATION_SCHEMA
.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'DeleteMetricConfig'
)
DROP PROCEDURE dbo.DeleteMetricConfig
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.DeleteMetricConfig
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
DELETE FROM RelMetricConfiguration
    WHERE UniqueKey = @UniqueKey
    GO
GO


-- Delete rows from table 'RelMetricConfiguration'
-- DELETE FROM RelMetricConfiguration
-- WHERE UniqueKey = 'da65b09f-cbbf-ec11-997e-2818787e4d7f'	/* add search conditions here */
-- GO