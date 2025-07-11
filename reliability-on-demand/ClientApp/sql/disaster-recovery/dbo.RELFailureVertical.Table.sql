/****** Object:  Table [dbo].[RELFailureVertical]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELFailureVertical]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELFailureVertical](
	[VerticalName] [varchar](96) NOT NULL,
	[FailureEventNameList] [varchar](256) NOT NULL,
	[FailureEventGroup] [varchar](96) NULL,
	[PivotSourceSubType] [varchar](96) NULL,
	[IsSubVertical] [bit] NOT NULL,
	[ParentVerticalName] [varchar](96) NULL,
	[FailureSourceName] [varchar](128) NULL,
	[VerticalFilterExpression] [varchar](500) NULL,
	[FailureFeederIgnored] [bit] NULL,
	[HashString] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[HashString] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
