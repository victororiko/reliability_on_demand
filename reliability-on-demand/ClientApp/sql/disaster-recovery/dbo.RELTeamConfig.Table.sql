/****** Object:  Table [dbo].[RELTeamConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELTeamConfig]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELTeamConfig](
	[TeamID] [bigint] IDENTITY(-1,1) NOT NULL,
	[OwnerContact] [varchar](255) NULL,
	[OwnerTeamFriendlyName] [varchar](255) NOT NULL,
	[OwnerTriageAlias] [varchar](50) NULL,
	[ComputeResourceLocation] [varchar](max) NULL,
	[HashString] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TeamID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[HashString] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
