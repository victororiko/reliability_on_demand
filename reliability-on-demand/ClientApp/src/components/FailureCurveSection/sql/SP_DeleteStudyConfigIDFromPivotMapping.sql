/****** Object:  StoredProcedure [dbo].[DeleteStudyIDFromPivotMapping]    Script Date: 7/20/2022 2:11:15 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[DeleteStudyConfigIDFromPivotMapping]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig WHERE StudyConfigID = @StudyConfigID AND PivotSourceSubType LIKE @PivotSourceSubType
GO


