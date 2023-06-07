



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetAllStudyTypes]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT StudyType,Description,FailureJoinKeyExpressionCols,UsageJoinKeyExpressionCols,PopulationJoinKeyExpressionCols 
FROM [dbo].[RELStudyType] FOR JSON AUTO, Include_Null_Values