USE [ReliabilityReporting]
GO

/****** Object: Table [dbo].[RELStudyPivotConfig] Script Date: 7/5/2022 4:36:07 PM ******/
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
    AND sys.tables.name = 'RELStudyPivotConfig'
)
DROP TABLE [dbo].[RELStudyPivotConfig];


GO
CREATE TABLE [dbo].[RELStudyPivotConfig] (
	[PivotKey]				NVARCHAR(255)  NOT NULL,
    [PivotScopeID]          INT            NULL,
    [StudyConfigID]         INT        NOT NULL,
    [AggregateBy]           BIT        NOT NULL DEFAULT 0,
    [IsSelectColumn]        BIT        NOT NULL DEFAULT 0,
    [IsApportionColumn]     BIT        NOT NULL DEFAULT 0,
    [IsKeyColumn]           BIT        NOT NULL DEFAULT 0,
    [IsApportionJoinColumn] BIT        NOT NULL DEFAULT 0,
    [JoinPivotExpression]   VARCHAR (300)  NULL,
    [JoinPivotOp]           VARCHAR (10)   NULL,
    [IsPrimaryPivot]        BIT            NULL,
    [PivotSourceSubType]    VARCHAR (128)  NULL,
    [PivotExpression]       NVARCHAR (500) NULL,
	PRIMARY KEY([PivotKey],[StudyConfigID]),
	FOREIGN KEY([PivotKey]) REFERENCES [dbo].[RELPivotInfo]([PivotKey]) ON DELETE CASCADE
);


