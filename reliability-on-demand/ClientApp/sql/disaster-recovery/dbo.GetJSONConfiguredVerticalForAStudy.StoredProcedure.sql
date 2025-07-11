/****** Object:  StoredProcedure [dbo].[GetJSONConfiguredVerticalForAStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetJSONConfiguredVerticalForAStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetJSONConfiguredVerticalForAStudy] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetJSONConfiguredVerticalForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT f.VerticalName, PivotSourceSubType
FROM RELFailureVertical AS f INNER JOIN RELFailureVerticalConfig AS c ON f.VerticalName = c.VerticalName
WHERE c.StudyConfigID = @StudyConfigID
FOR JSON AUTO, Include_Null_Values
GO
