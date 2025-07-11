/****** Object:  StoredProcedure [dbo].[RIOD_GetAllStudyTypes]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetAllStudyTypes]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetAllStudyTypes] AS' 
END
GO




-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetAllStudyTypes]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT StudyType,Description,FailureJoinKeyExpressionCols,UsageJoinKeyExpressionCols,PopulationJoinKeyExpressionCols 
FROM [dbo].[RELStudyType] FOR JSON AUTO, Include_Null_Values
GO
