/****** Object:  StoredProcedure [dbo].[GetJSONConfiguredVerticalForAStudy]    Script Date: 7/18/2022 5:51:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetJSONConfiguredVerticalForAStudy]
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


