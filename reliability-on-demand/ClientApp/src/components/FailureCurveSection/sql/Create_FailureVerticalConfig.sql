/****** Object:  Table [dbo].[RELFailureVerticalConfig]    Script Date: 6/4/2022 3:19:14 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELFailureVerticalConfig]') AND type in (N'U'))
DROP TABLE [dbo].[RELFailureVerticalConfig]
GO

-- Recreating
/****** Object:  Table [dbo].[RELFailureVerticalConfig]    Script Date: 6/4/2022 3:15:33 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELFailureVerticalConfig](
	[StudyID] BIGINT FOREIGN KEY REFERENCES RELStudyConfig(StudyID) ON DELETE CASCADE,
	[VerticalName] [nvarchar](255) NOT NULL,
	[StudyType] [nvarchar](255) NULL,
	[HashString] NVARCHAR(255)  NOT NULL UNIQUE,
	CONSTRAINT PK_StudyVertical PRIMARY KEY (StudyID,VerticalName)
) ON [PRIMARY]
GO