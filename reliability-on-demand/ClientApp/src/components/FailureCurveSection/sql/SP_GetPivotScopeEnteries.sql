/****** Object:  StoredProcedure [dbo].[GetPivotScopeEnteries]    Script Date: 7/20/2022 2:36:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO







ALTER PROCEDURE [dbo].[GetPivotScopeEnteries]
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT PivotScopeID FROM RELStudyPivotConfig WHERE StudyConfigID=StudyConfigID AND PivotSourceSubType LIKE @PivotSourceSubType AND PivotScopeID != -1
GO


