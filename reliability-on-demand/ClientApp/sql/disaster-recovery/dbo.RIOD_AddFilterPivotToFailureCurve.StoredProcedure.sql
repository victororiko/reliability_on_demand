/****** Object:  StoredProcedure [dbo].[RIOD_AddFilterPivotToFailureCurve]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_AddFilterPivotToFailureCurve]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_AddFilterPivotToFailureCurve] AS' 
END
GO





-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_AddFilterPivotToFailureCurve]
	@PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotScopeValue /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELPivotScope(PivotScopeID,PivotScopeValue,PivotOperator,PivotKey) VALUES(@PivotScopeID,@PivotScopeValue,@PivotOperator,@PivotKey)
GO
