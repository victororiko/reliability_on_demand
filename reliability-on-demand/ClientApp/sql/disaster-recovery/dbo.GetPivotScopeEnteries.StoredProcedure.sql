/****** Object:  StoredProcedure [dbo].[GetPivotScopeEnteries]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetPivotScopeEnteries]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetPivotScopeEnteries] AS' 
END
GO







ALTER PROCEDURE [dbo].[GetPivotScopeEnteries]
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT PivotScopeID FROM RELStudyPivotConfig WHERE StudyConfigID=StudyConfigID AND PivotSourceSubType LIKE @PivotSourceSubType AND PivotScopeID != -1
GO
