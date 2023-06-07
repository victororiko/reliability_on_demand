
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetDefaultMetricConfigs]
    @StudyConfigID int = -1
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RelMetricConfiguration_Defaults
WHERE Vertical IN(
    SELECT vert.VerticalName FROM 
RELStudyTypeDefaultVertical AS dvert
INNER JOIN
RELFailureVertical AS vert
ON dvert.VerticalName = vert.VerticalName
INNER JOIN
RELStudyConfig AS config
ON config.StudyType = dvert.StudyType
WHERE StudyConfigID =  @StudyConfigID
    )
FOR JSON AUTO, Include_Null_Values