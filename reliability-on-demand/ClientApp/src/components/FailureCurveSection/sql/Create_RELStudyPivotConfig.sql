/****** Object:  Table [dbo].[RELStudyPivotConfig]    Script Date: 7/27/2022 2:18:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELStudyPivotConfig](
	[PivotKey] [nvarchar](255) NOT NULL,
	[PivotScopeID] [int] NOT NULL,
	[PivotScopeOperator] [varchar](5) NOT NULL,
	[StudyConfigID] [bigint] NOT NULL,
	[AggregateBy] [bit] NOT NULL,
	[IsSelectColumn] [bit] NOT NULL,
	[IsApportionColumn] [bit] NOT NULL,
	[IsKeyColumn] [bit] NOT NULL,
	[IsApportionJoinColumn] [bit] NOT NULL,
	[JoinPivotExpression] [varchar](300) NULL,
	[JoinPivotOp] [varchar](10) NULL,
	[IsPrimaryPivot] [bit] NULL,
	[PivotSourceSubType] [varchar](128) NULL,
	[PivotExpression] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[PivotKey] ASC,
	[StudyConfigID] ASC,
	[PivotScopeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [AggregateBy]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsSelectColumn]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsApportionColumn]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsKeyColumn]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsApportionJoinColumn]
GO

ALTER TABLE [dbo].[RELStudyPivotConfig]  WITH CHECK ADD FOREIGN KEY([PivotKey])
REFERENCES [dbo].[RELPivotInfo] ([PivotKey])
ON UPDATE CASCADE
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[RELStudyPivotConfig]  WITH CHECK ADD FOREIGN KEY([StudyConfigID])
REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
