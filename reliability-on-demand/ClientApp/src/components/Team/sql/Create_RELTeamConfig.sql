
USE ReliabilityReporting
-- clear defaults table
-- Drop the table 'RELTeamConfig' in schema 'dbo'
IF EXISTS (
    SELECT *
FROM sys.tables
    JOIN sys.schemas
    ON sys.tables.schema_id = sys.schemas.schema_id
WHERE sys.schemas.name = 'dbo'
    AND sys.tables.name = 'RELTeamConfig'
)
    DROP TABLE dbo.RELTeamConfig
GO

-- Recreate Table
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RELTeamConfig]
(
    [TeamID] BIGINT NOT NULL IDENTITY(-1,1),
    [OwnerContact] VARCHAR(255) NULL,
    [OwnerTeamFriendlyName] VARCHAR(255) NOT NULL,
    [OwnerTriageAlias] VARCHAR(50) NULL,
    [ComputeResourceLocation] VARCHAR(MAX) NULL,
    [HashString] VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY CLUSTERED ([TeamId] ASC)
);
GO

-- Insert rows into table 'RELTeamConfig'
INSERT INTO RELTeamConfig
    (
    [OwnerContact] ,
    [OwnerTeamFriendlyName] ,
    [OwnerTriageAlias] ,
    [ComputeResourceLocation] ,
    [HashString]
    )
VALUES
    (
        'cosreldata' ,
        'DefaultTeam' ,
        'cosreldata' ,
        'https://www.cosmos15.osdinfra.net/cosmos/asimov.partner.swat/' ,
        'DefaultTeam'
)
    ,(
        'OSGRELDev',
        'Platform Health Reliability Team',
        'cosreldata',
        'https://cosmos15.osdinfra.net/cosmos/asimov.partner.swat',
        'CLIENT FUN TEAM'
    )
GO

