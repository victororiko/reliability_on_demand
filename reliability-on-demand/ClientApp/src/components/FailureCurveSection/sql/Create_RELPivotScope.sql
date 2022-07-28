/****** Object:  Table [dbo].[RELPivotScope]    Script Date: 7/22/2022 2:22:07 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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
GO

ALTER TABLE [dbo].[RELPivotScope]  WITH CHECK ADD FOREIGN KEY([PivotKey])
REFERENCES [dbo].[RELPivotInfo] ([PivotKey])
ON DELETE CASCADE ON UPDATE CASCADE
GO


