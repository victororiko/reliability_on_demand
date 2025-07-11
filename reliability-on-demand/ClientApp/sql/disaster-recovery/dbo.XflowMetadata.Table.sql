/****** Object:  Table [dbo].[XflowMetadata]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[XflowMetadata]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[XflowMetadata](
	[ExecutionID] [uniqueidentifier] NOT NULL,
	[WorkflowName] [nvarchar](255) NOT NULL,
	[Started] [datetime] NOT NULL,
	[Finished] [datetime] NOT NULL,
	[Status] [nvarchar](255) NOT NULL,
UNIQUE NONCLUSTERED 
(
	[ExecutionID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
