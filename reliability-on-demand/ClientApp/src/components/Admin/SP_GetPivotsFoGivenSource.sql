/****** Object:  StoredProcedure [dbo].[GetPivotsFoGivenSource]    Script Date: 8/4/2022 2:32:28 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetPivotsFoGivenSource]
	@source /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotKey, PivotSourceColumnName,UIInputDataType,ADLDataType
	FROM RELPivotInfo
	WHERE PivotSource = @source
	FOR JSON AUTO, Include_Null_Values
GO