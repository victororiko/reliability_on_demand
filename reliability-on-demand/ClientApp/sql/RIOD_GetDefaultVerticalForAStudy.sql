
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetDefaultVerticalForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT vert.VerticalName,vert.PivotSourceSubType FROM 
RELStudyTypeDefaultVertical AS dvert
INNER JOIN
RELFailureVertical AS vert
ON dvert.VerticalName = vert.VerticalName
INNER JOIN
RELStudyConfig AS config
ON config.StudyType = dvert.StudyType
WHERE StudyConfigID =  @StudyConfigID
FOR JSON AUTO, Include_Null_Values