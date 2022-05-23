-- User configured Metric Config
-- Create a new stored procedure called 'GetTeamConfigs' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES

WHERE SPECIFIC_SCHEMA
= N'dbo'
    AND SPECIFIC_NAME = N'GetTeamConfigs'
)
DROP PROCEDURE dbo.GetTeamConfigs
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetTeamConfigs
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELTeamConfig
FOR JSON AUTO, Include_Null_Values
GO

GO