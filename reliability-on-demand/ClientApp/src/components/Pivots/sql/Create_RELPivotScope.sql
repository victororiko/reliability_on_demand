USE [ReliabilityReporting]
GO

/****** Object: Table [dbo].[RELPivotScope] Script Date: 7/5/2022 5:33:52 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF EXISTS (
    SELECT *
FROM sys.tables
    JOIN sys.schemas
    ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = 'dbo'
    AND sys.tables.name = 'RELPivotScope'
)
DROP TABLE [dbo].[RELPivotScope];


GO
CREATE TABLE [dbo].[RELPivotScope] (
    [PivotScopeOperator] VARCHAR (5)		NULL,
    [PivotScopeValue]    VARCHAR (256)		NULL,
    [PivotScopeID]       INT				NULL, -- New PivotScopeID = previous highest PivotScopeID + 1
	[PivotKey]			 NVARCHAR(255)  NOT NULL,
	FOREIGN KEY([PivotKey]) REFERENCES [dbo].[RELPivotInfo]([PivotKey]) ON DELETE CASCADE
);




