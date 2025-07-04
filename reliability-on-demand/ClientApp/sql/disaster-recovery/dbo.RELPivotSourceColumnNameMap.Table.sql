/****** Object:  Table [dbo].[RELPivotSourceColumnNameMap]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELPivotSourceColumnNameMap]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELPivotSourceColumnNameMap](
	[FromPivotKey] [nvarchar](255) NOT NULL,
	[FromPivotSource] [varchar](50) NOT NULL,
	[ToPivotKey] [nvarchar](255) NOT NULL,
	[ToPivotSource] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FromPivotKey] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
