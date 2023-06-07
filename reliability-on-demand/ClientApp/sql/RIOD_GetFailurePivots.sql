






-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetFailurePivots]
	@sourcesubtype /*parameter name*/ nvarchar(100) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotID,PivotSourceColumnName AS PivotName,UIInputDataType,PivotKey 
	FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource 
	WHERE info.PivotSourceSubType LIKE @sourcesubtype AND map.PivotSourceType LIKE 'Failure%' 
	FOR JSON AUTO, Include_Null_Values
