/****** Object:  StoredProcedure [dbo].[RIOD_DeleteStudyVerticals]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_DeleteStudyVerticals]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_DeleteStudyVerticals] AS' 
END
GO



ALTER PROCEDURE [dbo].[RIOD_DeleteStudyVerticals]
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELFailureVerticalConfig WHERE StudyConfigID = @StudyConfigID

GO
