/****** Object:  StoredProcedure [dbo].[GetMaximumStudyPivotConfigCount]    Script Date: 7/20/2022 1:56:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





-- Study Section
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetMaximumStudyPivotConfigCount]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyConfigID = @StudyConfigID AND PivotSourceSubType LIKE @PivotSourceSubType

GO


