/****** Object:  StoredProcedure [dbo].[RIOD_GetPivotScopeIDForFilterExp]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetPivotScopeIDForFilterExp]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetPivotScopeIDForFilterExp] AS' 
END
GO



ALTER PROCEDURE [dbo].[RIOD_GetPivotScopeIDForFilterExp]
    @PivotValue /*parameter name*/ varchar(256) /*datatype*/ = '' /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ varchar(5) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT TOP 1 PivotScopeID FROM RELPivotScope 
	WHERE PivotKey = @PivotKey AND PivotScopeValue = @PivotValue AND PivotOperator = @PivotOperator
GO
