/****** Object:  StoredProcedure [dbo].[DeleteStudyIDFromPivotMapping]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeleteStudyIDFromPivotMapping]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[DeleteStudyIDFromPivotMapping] AS' 
END
GO





ALTER PROCEDURE [dbo].[DeleteStudyIDFromPivotMapping]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig WHERE StudyID = @StudyID AND PivotSourceSubType LIKE @PivotSourceSubType
GO
