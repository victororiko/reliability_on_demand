/****** Object:  StoredProcedure [dbo].[DeleteStudyConfigIDFromPivotMapping]    Script Date: 8/12/2022 2:30:56 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROCEDURE [dbo].[DeleteStudyConfigIDFromPivotMapping] 
    @StudyConfigID /*parameter name*/ int /*datatype*/,
	@PivotSource /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig 
	WHERE StudyConfigID = @StudyConfigID AND PivotKey LIKE @PivotSource
GO