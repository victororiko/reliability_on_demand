/****** Object:  StoredProcedure [dbo].[RIOD_DeleteStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_DeleteStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_DeleteStudy] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_DeleteStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@TeamID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    DELETE FROM RELStudyConfig 
    WHERE StudyConfigID = @StudyConfigID AND 
    TeamID = @TeamID
GO
