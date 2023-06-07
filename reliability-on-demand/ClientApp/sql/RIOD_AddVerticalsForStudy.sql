


CREATE PROCEDURE [dbo].[RIOD_AddVerticalsForStudy]
	@Vertical /*parameter name*/ nvarchar(255) /*datatype*/,
    @StudyConfigID /*parameter name*/ bigint /*datatype*/
	
-- add more stored procedure parameters here
AS
	--get study hash string
	DECLARE @StudyHashString NVARCHAR(255);
	SELECT @StudyHashString = HashString FROM RELStudyConfig
	WHERE StudyConfigID = @StudyConfigID;

    -- body of the stored procedure
	INSERT INTO RELFailureVerticalConfig(StudyConfigID,VerticalName,HashString) VALUES(@StudyConfigID,@Vertical,CONCAT(@StudyHashString,'_',@Vertical))

