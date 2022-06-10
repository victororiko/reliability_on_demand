-- Create a new stored procedure called 'GetPopulationPivotSources' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES

WHERE SPECIFIC_SCHEMA
= N'dbo'
    AND SPECIFIC_NAME = N'GetPopulationPivotSources'
)
DROP PROCEDURE dbo.GetPopulationPivotSources
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetPopulationPivotSources
-- add more stored procedure parameters here
AS
-- body of the stored procedure
    SELECT * FROM RELPivotSourceMap
    WHERE PivotSourceType = 'PopulationSourceType'
    FOR JSON AUTO, Include_Null_Values
    GO
GO