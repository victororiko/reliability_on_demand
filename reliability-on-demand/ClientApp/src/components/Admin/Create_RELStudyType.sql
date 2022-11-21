/****** Object:  Table [dbo].[RELStudyType]    Script Date: 11/16/2022 1:25:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELStudyType](
	[StudyType] [varchar](255) NOT NULL,
	[Description] [varchar](255) NULL,
	[FailureJoinKeyExpressionCols] [varchar](255) NULL,
	[UsageJoinKeyExpressionCols] [varchar](255) NULL,
	[PopulationJoinKeyExpressionCols] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[StudyType] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


