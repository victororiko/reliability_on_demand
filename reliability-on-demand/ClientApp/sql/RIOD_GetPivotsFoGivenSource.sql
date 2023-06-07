

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetPivotsFoGivenSource]
	@source /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotKey, PivotSourceColumnName,UIInputDataType,ADLDataType
	FROM RELPivotInfo
	WHERE PivotSource = @source
	FOR JSON AUTO, Include_Null_Values
