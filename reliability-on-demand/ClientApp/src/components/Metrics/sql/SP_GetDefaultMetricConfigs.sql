CREATE PROCEDURE dbo.GetDefaultMetricConfigs
    @StudyConfigID int = -1
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RelMetricConfiguration_Defaults
WHERE Vertical IN(
    SELECT[VerticalName]
FROM [dbo].[RELFailureVerticalConfig]
WHERE StudyConfigID = @StudyConfigID
    )
FOR JSON AUTO, Include_Null_Values
    GO
GO