-- User configured Metric Config
-- Create a new stored procedure called 'GetMetricConfigs' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES

WHERE SPECIFIC_SCHEMA
= N'dbo'
    AND SPECIFIC_NAME = N'GetMetricConfigs'
)
DROP PROCEDURE dbo.GetMetricConfigs
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetMetricConfigs

    @StudyId /*parameter name*/ int
/*datatype_for_param1*/
= -1
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RelMetricConfiguration
WHERE StudyId = @StudyId
FOR JSON AUTO, Include_Null_Values
    go
GO