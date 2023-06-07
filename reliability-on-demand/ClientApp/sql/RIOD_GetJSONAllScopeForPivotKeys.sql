







CREATE PROCEDURE [dbo].[RIOD_GetJSONAllScopeForPivotKeys]
    @PivotKeys /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT scope.PivotKey,scope.PivotScopeID,scope.PivotOperator,scope.PivotScopeValue,info.PivotName,info.UIInputDataType
	FROM RELPivotScope AS scope
	INNER JOIN RELPivotInfo AS info
	ON scope.PivotKey = info.PivotKey
	WHERE scope.PivotKey IN (@PivotKeys) 
	FOR JSON AUTO, Include_Null_Values
