/****** Object:  Table [dbo].[RELPivotInfoTemp]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELPivotInfoTemp]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELPivotInfoTemp](
	[PivotID] [int] IDENTITY(1,1) NOT NULL,
	[UIInputDataType] [varchar](50) NULL,
	[ADLDataType] [varchar](1000) NULL,
	[IsPivotValueNullable] [bit] NULL,
	[PivotSource] [varchar](50) NULL,
	[PivotSourceColumnName] [varchar](1000) NULL,
	[PivotValueDataType] [varchar](50) NULL,
	[PivotName] [varchar](50) NULL,
	[PivotSourceSubType] [varchar](50) NULL,
	[PivotKey] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_PivotKeyTemp] PRIMARY KEY CLUSTERED 
(
	[PivotKey] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
