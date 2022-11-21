/****** Object:  StoredProcedure [dbo].[DeleteStudyType]    Script Date: 11/16/2022 10:34:54 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[DeleteStudyType]
    @StudyType /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyTypeDefaultVertical WHERE StudyType = @StudyType
GO


