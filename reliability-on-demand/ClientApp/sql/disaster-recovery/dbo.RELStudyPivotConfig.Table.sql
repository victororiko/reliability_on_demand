/****** Object:  Table [dbo].[RELStudyPivotConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELStudyPivotConfig]') AND type in (N'U'))
BEGIN
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
	[IsUsagePivot] [bit] NULL,
	[PivotSourceSubType] [varchar](128) NULL,
	[PivotExpression] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[PivotKey] ASC,
	[StudyConfigID] ASC,
	[PivotScopeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyP__Aggre__380F7B74]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [AggregateBy]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyP__IsSel__39039FAD]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsSelectColumn]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyP__IsApp__39F7C3E6]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsApportionColumn]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyP__IsKey__3AEBE81F]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsKeyColumn]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyP__IsApp__3BE00C58]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyPivotConfig] ADD  DEFAULT ((0)) FOR [IsApportionJoinColumn]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELStudyP__Pivot__3CD43091]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyPivotConfig]'))
ALTER TABLE [dbo].[RELStudyPivotConfig]  WITH CHECK ADD FOREIGN KEY([PivotKey])
REFERENCES [dbo].[RELPivotInfo] ([PivotKey])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELStudyP__Study__3DC854CA]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyPivotConfig]'))
ALTER TABLE [dbo].[RELStudyPivotConfig]  WITH CHECK ADD FOREIGN KEY([StudyConfigID])
REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
