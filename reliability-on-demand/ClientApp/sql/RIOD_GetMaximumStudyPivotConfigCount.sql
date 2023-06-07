
-- Study Section
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetMaximumStudyPivotConfigCount]
    @PivotSource /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyConfigID = @StudyConfigID AND PivotKey LIKE @PivotSource

