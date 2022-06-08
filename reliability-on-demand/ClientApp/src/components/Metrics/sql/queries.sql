----------------- RelMetricConfiguration -----------------
select * from RelMetricConfiguration
go

SELECT * FROM dbo.RelMetricConfiguration_Defaults 
WHERE Vertical IN(
    SELECT[VerticalName] 
    FROM [dbo].[RELFailureVerticalConfig] 
    WHERE StudyID = 8
    )

    SELECT * 
    FROM [dbo].[RELFailureVerticalConfig]
    
select * from RELStudyConfig
select * from RELTeamConfig

----------------- RelMetricConfiguration_Defaults -----------------

-- Select rows from a Table or View 'RelMetricConfiguration_Defaults' in schema 'dbo'
SELECT *
FROM dbo.RelMetricConfiguration_Defaults
GO

-- clear defaults table
-- Drop the table 'RelMetricConfiguration_Defaults' in schema 'dbo'
IF EXISTS (
    SELECT *
FROM sys.tables
    JOIN sys.schemas
    ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = N'dbo'
    AND sys.tables.name = N'RelMetricConfiguration_Defaults'
)
    DROP TABLE dbo.RelMetricConfiguration_Defaults
GO

-- DISASTER RECOVERY
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RelMetricConfiguration_Defaults]
(
    [MetricName] [varchar](50) NULL,
    [Vertical] [varchar](50) NULL,
    [MinUsageInMS] [bigint] NULL,
    [HighUsageMinInMS] [bigint] NULL,
    [FailureRateInHour] [float] NULL,
    [MetricGoal] [float] NULL,
    [MetricGoalAspiration] [float] NULL,

[IsUsage] [bit]
NOT NULL,
    [UniqueKey] [UNIQUEIDENTIFIER] DEFAULT newsequentialid
() NOT null 
    
) ON [PRIMARY]
GO

-- Repopulate defaults
insert into dbo.RelMetricConfiguration_Defaults
    (
    MetricName,
    Vertical,
    MinUsageInMS,
    HighUsageMinInMS,
    FailureRateInHour,
    MetricGoal,
    MetricGoalAspiration,
    IsUsage
    )
values
    ('PCT_MACHS_BAD_EARLY', 'oscrash', 1, 10800000, 0.0476, 0.05, 0.04, 1),
    ('PCT_MACHS_UNSTABLE_MTTF', 'oscrash', 10800000, 9223372036854775807, 0.0476, 0.05, 0.04, 1),
    ('PCT_MACHS_UNSTABLE_MTTF', 'appcrash', 1800000, 9223372036854775807, 0.2, 0.35, 0.25, 1),
    ('PCT_MACHS_BAD_EARLY', 'appcrash', 1, 1800000, 0.33333, 0.35, 0.25, 0),
    ('PCT_MACHS_UNSTABLE_MTTF', 'apphang', 1800000, 9223372036854775807, 0.125, 0.22, 0.2, 1),
    ('PCT_MACHS_BAD_EARLY', 'apphang', 1, 1800000, 0.125, 0.22, 0.2, 1),
    ('PCT_MACHS_UNSTABLE_MTTF', 'dirtyshutdown', 10800000, 9223372036854775807, 0.0666, 0.2, 0.2, 1),
    ('PCT_MACHS_BAD_EARLY', 'dirtyshutdown', 1, 10800000, 0.0666, 0.04, 0.04, 1)
GO
