/****** Object:  Table [dbo].[RELFailureVerticalConfig]    Script Date: 6/4/2022 3:15:33 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELFailureVerticalConfig](
	[StudyConfigID] BIGINT FOREIGN KEY REFERENCES RELStudyConfig(StudyConfigID) ON DELETE CASCADE,
	[VerticalName] [varchar](255) NOT NULL,
	[StudyType] [varchar](255) NULL,
	[HashString] VARCHAR(255)  NOT NULL UNIQUE,
	CONSTRAINT PK_StudyVertical PRIMARY KEY (StudyConfigID,VerticalName)
) ON [PRIMARY]
GO