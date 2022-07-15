/****** Object:  StoredProcedure [dbo].[GetFailurePivots]    Script Date: 7/14/2022 10:47:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetFailurePivots]
	@sourcesubtype /*parameter name*/ nvarchar(100) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotID,PivotSourceColumnName,UIInputDataType,PivotKey 
	FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource 
	WHERE info.PivotSourceSubType LIKE @sourcesubtype AND map.PivotSourceType LIKE 'Failure%' 
	FOR JSON AUTO, Include_Null_Values
GO


