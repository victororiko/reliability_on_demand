/****** Object:  StoredProcedure [dbo].[GetAllPivotValuesForGivenPivotKeyAndPivotOp]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetAllPivotValuesForGivenPivotKeyAndPivotOp]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetAllPivotValuesForGivenPivotKeyAndPivotOp] AS' 
END
GO

ALTER PROCEDURE [dbo].[GetAllPivotValuesForGivenPivotKeyAndPivotOp]
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ varchar(5) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT PivotScopeID,PivotScopeValue FROM RELPivotScope 
	WHERE PivotKey=@PivotKey AND PivotOperator=@PivotOperator
	FOR JSON AUTO, Include_Null_Values
GO
