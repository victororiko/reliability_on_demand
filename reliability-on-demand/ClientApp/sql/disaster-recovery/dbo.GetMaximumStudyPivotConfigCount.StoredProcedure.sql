/****** Object:  StoredProcedure [dbo].[GetMaximumStudyPivotConfigCount]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetMaximumStudyPivotConfigCount]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetMaximumStudyPivotConfigCount] AS' 
END
GO

-- Study Section
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetMaximumStudyPivotConfigCount]
    @PivotSource /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyConfigID = @StudyConfigID AND PivotKey LIKE @PivotSource

GO
