/****** Object:  Table [dbo].[RELMetricDefinition]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELMetricDefinition]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELMetricDefinition](
	[MetricId] [int] IDENTITY(1,1) NOT NULL,
	[Operation] [varchar](255) NULL,
	[MetricName] [varchar](255) NULL,
	[GoalEvaluationExpression] [varchar](50) NULL,
	[MetricsNumerator] [varchar](255) NULL,
	[MetricsDenominator] [varchar](255) NULL,
	[IsUsage] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[MetricId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
