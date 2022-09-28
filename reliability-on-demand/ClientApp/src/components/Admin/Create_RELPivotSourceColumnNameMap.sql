/****** Object:  Table [dbo].[RELPivotSourceColumnNameMap]    Script Date: 9/28/2022 9:42:25 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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
GO


