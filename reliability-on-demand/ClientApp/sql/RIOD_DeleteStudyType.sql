



CREATE PROCEDURE [dbo].[RIOD_DeleteStudyType]
    @StudyType /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyTypeDefaultVertical WHERE StudyType = @StudyType
