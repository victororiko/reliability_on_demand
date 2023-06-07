


CREATE PROCEDURE [dbo].[RIOD_DeleteStudyVerticals]
    @StudyConfigID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELFailureVerticalConfig WHERE StudyConfigID = @StudyConfigID

