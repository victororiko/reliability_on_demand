



CREATE PROCEDURE [dbo].[RIOD_SaveVerticalsForStudyType]
	@Vertical /*parameter name*/ varchar(96) /*datatype*/,
    @StudyType /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	INSERT INTO RELStudyTypeDefaultVertical(StudyType,VerticalName) 
	VALUES(@StudyType,@Vertical)

