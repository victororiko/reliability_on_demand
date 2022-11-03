-- Create table if it doesn't exist
IF EXISTS (
	SELECT *
FROM sys.tables
	JOIN sys.schemas
	ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = 'dbo'
	AND sys.tables.name = 'RelMetricConfiguration'
)
	DROP TABLE dbo.RelMetricConfiguration
GO

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
    [StudyConfigID] BIGINT NOT NULL,
    [MetricGoalAspirational] [float] NULL,
    [IsUsage] [bit] NULL,
    [UniqueKey] [UNIQUEIDENTIFIER] DEFAULT newsequentialid() NOT NULL,
    [HashString] VARCHAR(255)  NOT NULL UNIQUE,
    [PivotKey] [nvarchar](255),
    [PivotScopeID] [int],
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([StudyConfigID]) REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID]) ON DELETE CASCADE,
    FOREIGN KEY ([PivotKey],[StudyConfigID],[PivotScopeID] ) REFERENCES [dbo].[RELStudyPivotConfig] ([PivotKey],[StudyConfigID],[PivotScopeID])
);
GO
-- end create table