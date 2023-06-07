


CREATE PROCEDURE [dbo].[RIOD_GetPivotScopeIDForFilterExp]
    @PivotValue /*parameter name*/ varchar(256) /*datatype*/ = '' /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ varchar(5) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT TOP 1 PivotScopeID FROM RELPivotScope 
	WHERE PivotKey = @PivotKey AND PivotScopeValue = @PivotValue AND PivotOperator = @PivotOperator
