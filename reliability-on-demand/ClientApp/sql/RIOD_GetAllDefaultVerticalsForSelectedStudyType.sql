





-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetAllDefaultVerticalsForSelectedStudyType]
	@StudyType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT * FROM(
SELECT s.VerticalName, f.PivotSourceSubType 
FROM [dbo].[RELStudyTypeDefaultVertical] AS s
INNER JOIN RELFailureVertical AS f ON s.VerticalName = f.VerticalName
WHERE StudyType = @StudyType) AS res
FOR JSON AUTO, Include_Null_Values
