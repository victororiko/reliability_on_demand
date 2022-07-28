/****** Object:  StoredProcedure [dbo].[GetPivotScopeIDForFilterExp]    Script Date: 7/28/2022 1:35:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GetPivotScopeIDForFilterExp]
    @PivotValue /*parameter name*/ varchar(256) /*datatype*/ = '' /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ varchar(5) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT TOP 1 PivotScopeID FROM RELPivotScope 
	WHERE PivotKey = @PivotKey AND PivotScopeValue = @PivotValue AND PivotOperator = @PivotOperator
GO


