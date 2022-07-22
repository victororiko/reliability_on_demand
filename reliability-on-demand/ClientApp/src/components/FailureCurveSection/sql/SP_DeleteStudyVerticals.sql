/****** Object:  StoredProcedure [dbo].[DeleteStudyVerticals]    Script Date: 7/20/2022 2:02:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROCEDURE [dbo].[DeleteStudyVerticals]
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELFailureVerticalConfig WHERE StudyConfigID = @StudyConfigID

GO


