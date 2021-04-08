--Stuff

select *
from INFORMATION_SCHEMA.COLUMNS
where TABLE_NAME='RELTeamConfig'

select *
from [dbo].[RELTeamConfig]

-- Altering Columns
-- ALTER TABLE RELUnifiedStudy
-- ALTER COLUMN [CacheFrequency] int NOT NULL

-- Setting Primary Key
ALTER TABLE RELUnifiedStudy
ADD FOREIGN KEY (ConfigID) REFERENCES RELUnifiedConfig(ConfigID)


-- JSON
SELECT * 
FROM RELUnifiedConfig
FOR JSON AUTO, Root('JValue'), Include_Null_Values


SELECT * 
FROM RELUnifiedConfig



DROP TABLE [dbo].[RELStudyConfig]

CREATE TABLE [dbo].[RELStudyConfig] (
    [StudyID]          INT IDENTITY(1,1),
    [StudyName]        NVARCHAR (128)   NOT NULL,
    [LastRefreshDate]  DATETIME         NOT NULL,
    [LastModifiedDate] DATETIME         NOT NULL,
    [CacheFrequency]   INT              NOT NULL,
    [Expiry]           DATETIME         NOT NULL,
    [TeamID]           INT              NOT NULL,
    PRIMARY KEY CLUSTERED ([StudyID] ASC),
    FOREIGN KEY ([TeamID]) REFERENCES [dbo].[RELTeamConfig] ([TeamID])
);

-- adding studies
-- Insert rows into table 'RELStudyConfig'
INSERT INTO RELStudyConfig
( -- columns to insert data into
 StudyName,LastRefreshDate, LastModifiedDate,CacheFrequency,Expiry,TeamID
)
VALUES
( -- first row: values for the columns in the list above
 'Retail Studies - every 3 days','20210218 10:34:09 AM','20210218 10:34:09 AM','72','20210518 10:34:09 AM','3'
)
-- add more rows here
GO

DROP TABLE [dbo].[RELTeamConfig]

CREATE TABLE [dbo].[RELTeamConfig] (
    [TeamID]          INT IDENTITY(1,1),
    [OwnerContact]        NVARCHAR (255)   NOT NULL,
    [OwnerTeamFriendlyName]        NVARCHAR (255)   NOT NULL,
    [OwnerTriageAlias]        NVARCHAR (255)   NOT NULL,
    PRIMARY KEY CLUSTERED ([TeamID] ASC)
);

-- INSERT INTO [dbo].[RELTeamConfig]
-- VALUES ('KARANDA','CLIENT FUN TEAM 2', 'COSRELDATA') 

INSERT INTO [dbo].[RELTeamConfig]
VALUES ('rajroy','CLIENT FUN TEAM 3', 'OSGRELDATA')


ALTER TABLE [dbo].[RELStudyConfig]
ADD ObservationWindowDays int NOT NULL DEFAULT(14)
GO

SELECT * from dbo.RELStudyConfig

-- Select rows from a Table or View 'RELTeamConfig' in schema 'dbo'
SELECT * FROM dbo.RELTeamConfig
FOR JSON AUTO, Include_Null_Values
GO


--- lengthy stored procs
-- Create a new stored procedure called 'GetAllStudyConfigsForTeam' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'GetAllStudyConfigsForTeam'
)
DROP PROCEDURE dbo.GetAllStudyConfigsForTeam
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetAllStudyConfigsForTeam
    @TeamID /*parameter name*/ int /*datatype_for_TeamID*/ = 0 /*default_value_for_TeamID*/
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT *
    FROM dbo.RELStudyConfig
    WHERE TeamID = @TeamID
    FOR JSON AUTO, Include_Null_Values
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.GetAllStudyConfigsForTeam 0 /*value_for_TeamID*/
GO

-- Examples for adding a new team
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddTeam
    @OwnerContact /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerContact provided' /*default value*/,
	@OwnerTeamFriendlyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTeamFriendlyName provided' /*default value*/, 
	@OwnerTriageAlias /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTriageAlias provided' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO [dbo].[RELTeamConfig]
	VALUES (@OwnerContact, @OwnerTeamFriendlyName, @OwnerTriageAlias)


EXECUTE dbo.AddTeam 'hello', 'world', 'hello@world.com'
GO


