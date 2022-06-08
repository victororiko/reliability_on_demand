USE ReliabilityReporting
-- Drop the table 'RelMetricConfiguration' in schema 'dbo'
IF EXISTS (
    SELECT *
FROM sys.tables
    JOIN sys.schemas
    ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = N'dbo'
    AND sys.tables.name = N'RelMetricConfiguration'
)
    DROP TABLE dbo.RelMetricConfiguration
GO

-- DISASTER_RECOVERY: recreate table if it doesn't exist
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='RelMetricConfiguration' and xtype='U')
-- Create table
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RelMetricConfiguration]
(
    [Id] INT IDENTITY(1,1) NOT NULL,
    [MetricName] [varchar](255) NULL,
    [Vertical] [varchar](255) NULL,
    [MinUsageInMS] [bigint] NULL,
    [FailureRateInHour] [float] NULL,
    [HighUsageMinInMS] [bigint] NULL,
    [MetricGoal] [float] NULL,
    [StudyId] BIGINT NOT NULL,
    [MetricGoalAspirational] [float] NULL,
    [IsUsage] [bit] NULL,
    [UniqueKey] [UNIQUEIDENTIFIER] DEFAULT newsequentialid() NOT NULL,
    [HashString] VARCHAR(255)  NOT NULL UNIQUE,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([StudyId]) REFERENCES [dbo].[RELStudyConfig] ([StudyId]) ON DELETE CASCADE
);
-- end create table