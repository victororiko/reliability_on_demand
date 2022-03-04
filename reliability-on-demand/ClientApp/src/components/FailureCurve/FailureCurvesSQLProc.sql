/****** Object:  StoredProcedure [dbo].[GetMaximumStudyPivotConfigCount]    Script Date: 3/2/2022 8:44:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[GetMaximumStudyPivotConfigCount]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyID = @StudyID AND PivotSourceSubType LIKE @PivotSourceSubType

EXEC dbo.GetMaximumStudyPivotConfigCount 
    @StudyID = 1,
    @PivotSourceSubType = ''



SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[GetMaximumPivotScopeCount]
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT max(PivotScopeID) AS max FROM RELPivotScope

EXEC dbo.GetMaximumPivotScopeCount




CREATE PROCEDURE [dbo].[DeleteStudyIDFromPivotMapping]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig WHERE StudyID = @StudyID AND PivotSourceSubType LIKE @PivotSourceSubType

EXEC dbo.DeleteStudyIDFromPivotMapping
    @StudyID = 1,
    @PivotSourceSubType = ''


CREATE PROCEDURE [dbo].[DeletePivotScopeEnteries]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELPivotScope WHERE PivotScopeID IN (SELECT PivotScopeID FROM RELStudyPivotConfig WHERE StudyID=@StudyID AND PivotSourceSubType=@PivotSourceSubType)

EXEC dbo.DeletePivotScopeEnteries
    @StudyID = 1,
    @PivotSourceSubType = ''


CREATE PROCEDURE [dbo].[DeleteStudyVerticals]
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELFailureVerticalConfig WHERE StudyID = @StudyID

EXEC dbo.DeleteStudyVerticals
    @StudyID = 1



CREATE PROCEDURE [dbo].[AddVerticalsForStudy]
	@Vertical /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/,
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	INSERT INTO RELFailureVerticalConfig(StudyID,VerticalName) VALUES(@StudyID,@Vertical)

EXEC dbo.AddVerticalsForStudy
    @StudyID = 1,
	@Vertical=''

