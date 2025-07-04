/****** Object:  Table [dbo].[RELPivotScope]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELPivotScope]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[RELPivotScope](
	[PivotOperator] [varchar](5) NULL,
	[PivotScopeValue] [varchar](256) NULL,
	[PivotScopeID] [int] NOT NULL,
	[PivotKey] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PivotScopeID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__RELPivotS__Pivot__587C4B06]') AND parent_object_id = OBJECT_ID(N'[dbo].[RELPivotScope]'))
ALTER TABLE [dbo].[RELPivotScope]  WITH CHECK ADD FOREIGN KEY([PivotKey])
REFERENCES [dbo].[RELPivotInfo] ([PivotKey])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
