/****** Object:  StoredProcedure [dbo].[dbo.GetFailurePivots]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[dbo.GetFailurePivots]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[dbo.GetFailurePivots] AS' 
END
GO




-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[dbo.GetFailurePivots]
	@sourcesubtype /*parameter name*/ nvarchar(100) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotID,PivotSourceColumnName,UIInputDataType,PivotKey FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource WHERE info.PivotSourceSubType LIKE @sourcesubtype AND map.PivotSourceType LIKE 'Failure%' FOR JSON AUTO, Include_Null_Values
GO
