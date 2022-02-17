-- check newly added results
select *
from RelMetricConfiguration
where StudyId = 283
FOR JSON AUTO, Include_Null_Values
go

-- Disaster recovery: recreate table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RelMetricConfiguration' and xtype='U')
-- Create table
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RelMetricConfiguration](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MetricName] [varchar](255) NULL,
	[Vertical] [varchar](255) NULL,
	[MinUsageInMS] [bigint] NULL,
	[FailureRateInHour] [float] NULL,
	[HighUsageMinInMS] [bigint] NULL,
	[MetricGoal] [float] NULL,
	[StudyId] [int] NOT NULL,
	[MetricGoalAspirational] [float] NULL,
	[IsUsage] [bit] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[RelMetricConfiguration] ADD  CONSTRAINT [PK__Id] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
-- end create table
GO

-- Create a new stored procedure called 'AddMetricConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddMetricConfig'
)
DROP PROCEDURE dbo.AddMetricConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddMetricConfig
    @MetricName /*parameter name*/ varchar(255) /*datatype*/ = 'no metric name provided', /*default_value*/
    @Vertical /*parameter name*/ varchar(255) /*datatype*/ = 'no vertical provided', /*default_value*/
    @MinUsageInMS /*parameter name*/ bigint /*datatype*/ = null, /*default_value*/
    @FailureRateInHour /*parameter name*/ float /*datatype*/ = null, /*default_value*/
    @HighUsageMinInMS /*parameter name*/ bigint /*datatype*/ = null, /*default_value*/
    @MetricGoal /*parameter name*/ float /*datatype*/ = null, /*default_value*/
    @StudyId /*parameter name*/ int /*datatype*/ = -1, /*default_value*/
    @MetricGoalAspirational /*parameter name*/ float /*datatype*/ = null, /*default_value*/
    @IsUsage /*parameter name*/ bit /*datatype*/ = 1 /*default_value*/
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
-- adding example values with a study
EXECUTE dbo.AddMetricConfig 'hello','appcrash',1,0.077,1234,0.5,284,0.2,1
GO

-- adding only default values
EXECUTE dbo.AddMetricConfig
GO

-- User configured Metric Config
-- Create a new stored procedure called 'GetMetricConfigs' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'GetMetricConfigs'
)
DROP PROCEDURE dbo.GetMetricConfigs
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetMetricConfigs
    @StudyId /*parameter name*/ int /*datatype_for_param1*/ = -1 /*default_value_for_param1*/
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT *
    FROM RelMetricConfiguration
    WHERE StudyId = @StudyId
    FOR JSON AUTO, Include_Null_Values
    go
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.GetMetricConfigs 283 /*value_for_param1*/
GO
