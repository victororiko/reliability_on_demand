/****** Object:  StoredProcedure [dbo].[GetStudyDetailsForAGivenStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetStudyDetailsForAGivenStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetStudyDetailsForAGivenStudyConfigID] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetStudyDetailsForAGivenStudyConfigID]
-- add more stored procedure parameters here
	@StudyConfigID /*parameter name*/ int /*datatype*/
AS
-- body of the stored procedure
SELECT CacheFrequency,Expiry
FROM RELStudyConfig
WHERE StudyConfigID = @StudyConfigID
GO
