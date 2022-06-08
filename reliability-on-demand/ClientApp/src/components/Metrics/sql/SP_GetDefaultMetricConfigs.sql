-- Default Metric Config
-- Create a new stored procedure called 'GetDefaultMetricConfigs' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES

WHERE SPECIFIC_SCHEMA
= N'dbo'
    AND SPECIFIC_NAME = N'GetDefaultMetricConfigs'
)
DROP PROCEDURE dbo.GetDefaultMetricConfigs
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetDefaultMetricConfigs
    @StudyId int = -1
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT * FROM dbo.RelMetricConfiguration_Defaults 
WHERE Vertical IN(
    SELECT[VerticalName] 
    FROM [dbo].[RELFailureVerticalConfig] 
    WHERE StudyID = @StudyId
    )
FOR JSON AUTO, Include_Null_Values
    GO
GO