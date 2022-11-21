/****** Object:  StoredProcedure [dbo].[GetAllDefaultVerticalsForSelectedStudyType]    Script Date: 11/14/2022 11:54:38 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetAllDefaultVerticalsForSelectedStudyType]
	@StudyType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT s.VerticalName, f.PivotSourceSubType 
FROM [dbo].[RELStudyTypeDefaultVertical] AS s
INNER JOIN RELFailureVertical AS f ON s.VerticalName = f.VerticalName 
WHERE s.StudyType = @StudyType
FOR JSON AUTO, Include_Null_Values
GO