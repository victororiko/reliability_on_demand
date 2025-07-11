/****** Object:  Table [dbo].[RELStudyTypeDefaultVertical]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELStudyTypeDefaultVertical]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELStudyTypeDefaultVertical](
	[StudyType] [varchar](255) NOT NULL,
	[VerticalName] [varchar](96) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[StudyType] ASC,
	[VerticalName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELStudyT__Study__293F3D9E]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELStudyTypeDefaultVertical]'))
ALTER TABLE [dbo].[RELStudyTypeDefaultVertical]  WITH CHECK ADD FOREIGN KEY([StudyType])
REFERENCES [dbo].[RELStudyType] ([StudyType])
GO
