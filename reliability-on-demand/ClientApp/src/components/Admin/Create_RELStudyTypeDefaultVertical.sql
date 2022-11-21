/****** Object:  Table [dbo].[RELStudyTypeDefaultVertical]    Script Date: 11/15/2022 10:12:47 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELStudyTypeDefaultVertical](
	[StudyType] [varchar](255) NOT NULL,
	[VerticalName] [varchar](96) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[StudyType] ASC,
	[VerticalName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
FOREIGN KEY (StudyType) REFERENCES RELStudyType(StudyType)
) ON [PRIMARY]
GO