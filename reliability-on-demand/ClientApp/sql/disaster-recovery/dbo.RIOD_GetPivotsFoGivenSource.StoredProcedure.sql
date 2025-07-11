/****** Object:  StoredProcedure [dbo].[RIOD_GetPivotsFoGivenSource]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetPivotsFoGivenSource]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetPivotsFoGivenSource] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetPivotsFoGivenSource]
	@source /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotKey, PivotSourceColumnName,UIInputDataType,ADLDataType
	FROM RELPivotInfo
	WHERE PivotSource = @source
	FOR JSON AUTO, Include_Null_Values
GO
