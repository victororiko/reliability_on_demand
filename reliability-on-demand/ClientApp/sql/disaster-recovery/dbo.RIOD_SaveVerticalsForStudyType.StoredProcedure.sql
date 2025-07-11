/****** Object:  StoredProcedure [dbo].[RIOD_SaveVerticalsForStudyType]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_SaveVerticalsForStudyType]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_SaveVerticalsForStudyType] AS' 
END
GO




ALTER PROCEDURE [dbo].[RIOD_SaveVerticalsForStudyType]
	@Vertical /*parameter name*/ varchar(96) /*datatype*/,
    @StudyType /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	INSERT INTO RELStudyTypeDefaultVertical(StudyType,VerticalName) 
	VALUES(@StudyType,@Vertical)

GO
