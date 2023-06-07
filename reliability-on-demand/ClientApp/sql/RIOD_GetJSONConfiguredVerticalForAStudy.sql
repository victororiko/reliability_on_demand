


-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetJSONConfiguredVerticalForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT f.VerticalName, PivotSourceSubType
FROM RELFailureVertical AS f INNER JOIN RELFailureVerticalConfig AS c ON f.VerticalName = c.VerticalName
WHERE c.StudyConfigID = @StudyConfigID
FOR JSON AUTO, Include_Null_Values
