/****** Object:  Table [dbo].[RELStudyConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELStudyConfig]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELStudyConfig](
	[StudyConfigID] [bigint] IDENTITY(-1,1) NOT NULL,
	[StudyName] [nvarchar](128) NOT NULL,
	[LastRefreshDate] [datetime] NOT NULL,
	[CacheFrequency] [int] NOT NULL,
	[Expiry] [datetime] NOT NULL,
	[TeamID] [bigint] NOT NULL,
	[ObservationWindowDays] [int] NOT NULL,
	[HashString] [varchar](255) NOT NULL,
	[StudyType] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[StudyConfigID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[HashString] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELStudyC__Obser__306E59AC]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyConfig] ADD  DEFAULT ((14)) FOR [ObservationWindowDays]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_RELStudyConfig_StudyType]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELStudyConfig] ADD  CONSTRAINT [DF_RELStudyConfig_StudyType]  DEFAULT ('OS') FOR [StudyType]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELStudyC__TeamI__31627DE5]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyConfig]'))
ALTER TABLE [dbo].[RELStudyConfig]  WITH CHECK ADD FOREIGN KEY([TeamID])
REFERENCES [dbo].[RELTeamConfig] ([TeamID])
ON DELETE CASCADE
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_RELStudyConfig_RELStudyType]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyConfig]'))
ALTER TABLE [dbo].[RELStudyConfig]  WITH CHECK ADD  CONSTRAINT [FK_RELStudyConfig_RELStudyType] FOREIGN KEY([StudyType])
REFERENCES [dbo].[RELStudyType] ([StudyType])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_RELStudyConfig_RELStudyType]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyConfig]'))
ALTER TABLE [dbo].[RELStudyConfig] CHECK CONSTRAINT [FK_RELStudyConfig_RELStudyType]
GO
