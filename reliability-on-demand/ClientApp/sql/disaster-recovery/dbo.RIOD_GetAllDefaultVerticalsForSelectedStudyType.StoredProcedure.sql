/****** Object:  StoredProcedure [dbo].[RIOD_GetAllDefaultVerticalsForSelectedStudyType]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetAllDefaultVerticalsForSelectedStudyType]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetAllDefaultVerticalsForSelectedStudyType] AS' 
END
GO






-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetAllDefaultVerticalsForSelectedStudyType]
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
GO
