/****** Object:  Table [dbo].[RELPivotSourceMap]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELPivotSourceMap]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELPivotSourceMap](
	[PivotSource] [varchar](50) NULL,
	[PivotSourcePath] [nvarchar](500) NULL,
	[PivotSourceType] [varchar](20) NULL,
	[PivotSourceViewPath] [varchar](500) NULL
) ON [PRIMARY]
END
GO
