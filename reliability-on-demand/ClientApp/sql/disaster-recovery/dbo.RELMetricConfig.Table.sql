/****** Object:  Table [dbo].[RELMetricConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELMetricConfig]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELMetricConfig](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MetricName] [varchar](255) NULL,
	[Vertical] [varchar](255) NULL,
	[MinUsageInMS] [bigint] NULL,
	[FailureRateInHour] [float] NULL,
	[HighUsageMinInMS] [bigint] NULL,
	[MetricGoal] [float] NULL,
	[StudyConfigID] [bigint] NOT NULL,
	[MetricGoalAspirational] [float] NULL,
	[IsUsage] [bit] NULL,
	[UniqueKey] [uniqueidentifier] NOT NULL,
	[HashString] [varchar](255) NOT NULL,
	[PivotKey] [nvarchar](255) NULL,
	[PivotScopeID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[HashString] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELMetric__Uniqu__2E585EE9]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELMetricConfig] ADD  DEFAULT (newsequentialid()) FOR [UniqueKey]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELMetric__Study__2F4C8322]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELMetricConfig]'))
ALTER TABLE [dbo].[RELMetricConfig]  WITH CHECK ADD FOREIGN KEY([StudyConfigID])
REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID])
ON DELETE CASCADE
GO
