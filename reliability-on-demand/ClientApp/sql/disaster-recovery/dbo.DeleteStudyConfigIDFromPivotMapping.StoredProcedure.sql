/****** Object:  StoredProcedure [dbo].[DeleteStudyConfigIDFromPivotMapping]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeleteStudyConfigIDFromPivotMapping]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[DeleteStudyConfigIDFromPivotMapping] AS' 
END
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
