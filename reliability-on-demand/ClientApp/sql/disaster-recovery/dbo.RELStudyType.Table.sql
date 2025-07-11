/****** Object:  Table [dbo].[RELStudyType]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELStudyType]') AND type in (N'U'))
BEGIN
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
END
GO
