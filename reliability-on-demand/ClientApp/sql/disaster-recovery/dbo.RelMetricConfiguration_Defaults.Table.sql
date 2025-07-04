/****** Object:  Table [dbo].[RelMetricConfiguration_Defaults]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RelMetricConfiguration_Defaults]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RelMetricConfiguration_Defaults](
	[MetricName] [varchar](50) NULL,
	[Vertical] [varchar](50) NULL,
	[MinUsageInMS] [bigint] NULL,
	[HighUsageMinInMS] [bigint] NULL,
	[FailureRateInHour] [float] NULL,
	[MetricGoal] [float] NULL,
	[MetricGoalAspiration] [float] NULL,
	[IsUsage] [bit] NOT NULL,
	[UniqueKey] [uniqueidentifier] NOT NULL
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RelMetric__Uniqu__1E331135]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RelMetricConfiguration_Defaults] ADD  DEFAULT (newsequentialid()) FOR [UniqueKey]
END
GO
