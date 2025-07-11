/****** Object:  Table [dbo].[RELPivotSourceUsageUnitMap]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELPivotSourceUsageUnitMap]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELPivotSourceUsageUnitMap](
	[UsagePivotKey] [nvarchar](255) NOT NULL,
	[PivotSource] [varchar](50) NOT NULL,
	[StudyType] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UsagePivotKey] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__RELPivotS__Study__5783948D]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[RELPivotSourceUsageUnitMap] ADD  DEFAULT ('OS') FOR [StudyType]
END
GO
