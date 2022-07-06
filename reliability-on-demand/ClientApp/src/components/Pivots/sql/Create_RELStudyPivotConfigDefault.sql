USE [ReliabilityReporting]
GO

/****** Object: Table [dbo].[RELStudyPivotConfigDefault] Script Date: 7/5/2022 5:26:40 PM ******/
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
    AND sys.tables.name = 'RELStudyPivotConfigDefault'
)
DROP TABLE [dbo].[RELStudyPivotConfigDefault];

GO
CREATE TABLE [dbo].[RELStudyPivotConfigDefault] (
    [PivotScopeID]          INT            NULL,
    [AggregateBy]           BIT            NOT NULL DEFAULT 0,
    [IsSelectColumn]        BIT            NOT NULL DEFAULT 0,
    [IsApportionColumn]     BIT            NOT NULL DEFAULT 0,
    [IsKeyColumn]           BIT            NOT NULL DEFAULT 0,
    [IsApportionJoinColumn] BIT            NOT NULL DEFAULT 0,
    [JoinPivotExpression]   VARCHAR (300)  NULL,
    [JoinPivotOp]           VARCHAR (10)   NULL,
    [IsPrimaryPivot]        BIT            NULL,
    [PivotSourceSubType]    NVARCHAR (150) NOT NULL,
    [PivotKey]              NVARCHAR (255) NOT NULL,
    [PivotExpression]       NVARCHAR (500) NULL,
    CONSTRAINT [PK_PivotKey_PivotSourceSubType] PRIMARY KEY CLUSTERED ([PivotKey] ASC, [PivotSourceSubType] ASC)
);



