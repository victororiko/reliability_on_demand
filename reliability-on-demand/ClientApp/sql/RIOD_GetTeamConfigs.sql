
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_GetTeamConfigs
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELTeamConfig 
-- WHERE TeamID > -1 
FOR JSON AUTO, Include_Null_Values
