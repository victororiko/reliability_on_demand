/****** Object:  StoredProcedure [dbo].[GetAllStudyTypes]    Script Date: 11/14/2022 11:16:35 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAllStudyTypes]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT StudyType,Description FROM [dbo].[RELStudyType] FOR JSON AUTO, Include_Null_Values
GO


