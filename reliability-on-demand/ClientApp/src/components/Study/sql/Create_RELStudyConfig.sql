
USE ReliabilityReporting
-- Drop the table 'RELStudyConfig' in schema 'dbo'
IF EXISTS (
    SELECT *
FROM sys.tables
    JOIN sys.schemas
    ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = 'dbo'
    AND sys.tables.name = 'RELStudyConfig'
)
    DROP TABLE dbo.RELStudyConfig
GO

-- Recreate Table
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RELStudyConfig]
(
    [StudyConfigID] BIGINT IDENTITY NOT NULL,
    [StudyName] NVARCHAR (128) NOT NULL,
    [LastRefreshDate] DATETIME NOT NULL,
    [CacheFrequency] INT NOT NULL,
    [Expiry] DATETIME NOT NULL,
    [TeamID] BIGINT NOT NULL,
    [ObservationWindowDays] INT NOT NULL DEFAULT(14),

[HashString] VARCHAR
(255) NOT NULL UNIQUE,
    PRIMARY KEY CLUSTERED ([StudyConfigID] ASC),
    FOREIGN KEY ([TeamID]) REFERENCES [dbo].[RELTeamConfig] ([TeamID]) ON DELETE CASCADE
);

