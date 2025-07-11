/****** Object:  StoredProcedure [dbo].[RIOD_AddVerticalsForStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_AddVerticalsForStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_AddVerticalsForStudy] AS' 
END
GO



ALTER PROCEDURE [dbo].[RIOD_AddVerticalsForStudy]
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

GO
