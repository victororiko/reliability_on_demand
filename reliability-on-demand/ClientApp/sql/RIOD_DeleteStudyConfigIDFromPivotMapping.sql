


CREATE PROCEDURE [dbo].[RIOD_DeleteStudyConfigIDFromPivotMapping] 
    @StudyConfigID /*parameter name*/ int /*datatype*/,
	@PivotSource /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig 
	WHERE StudyConfigID = @StudyConfigID AND PivotKey LIKE @PivotSource
