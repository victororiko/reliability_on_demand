/****** Object:  StoredProcedure [dbo].[GetMaximumStudyPivotConfigCount]    Script Date: 8/12/2022 2:28:41 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
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