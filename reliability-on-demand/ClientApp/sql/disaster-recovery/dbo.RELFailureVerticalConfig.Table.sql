/****** Object:  Table [dbo].[RELFailureVerticalConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELFailureVerticalConfig]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELFailureVerticalConfig](
	[StudyConfigID] [bigint] NOT NULL,
	[VerticalName] [varchar](255) NOT NULL,
	[StudyType] [varchar](255) NULL,
	[HashString] [varchar](255) NOT NULL,
 CONSTRAINT [PK_StudyVertical] PRIMARY KEY CLUSTERED 
(
	[StudyConfigID] ASC,
	[VerticalName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[HashString] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELFailur__Study__35330EC9]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELFailureVerticalConfig]'))
ALTER TABLE [dbo].[RELFailureVerticalConfig]  WITH CHECK ADD FOREIGN KEY([StudyConfigID])
REFERENCES [dbo].[RELStudyConfig] ([StudyConfigID])
ON DELETE CASCADE
GO
