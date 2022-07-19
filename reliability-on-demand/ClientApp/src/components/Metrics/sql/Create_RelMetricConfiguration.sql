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
    [StudyConfigID] BIGINT NOT NULL,
    [MetricGoalAspirational] [float] NULL,
    [IsUsage] [bit] NULL,
    [UniqueKey] [UNIQUEIDENTIFIER] DEFAULT newsequentialid() NOT NULL,
    [HashString] VARCHAR(255)  NOT NULL UNIQUE,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([StudyConfigID]) REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID]) ON DELETE CASCADE
);
-- end create table