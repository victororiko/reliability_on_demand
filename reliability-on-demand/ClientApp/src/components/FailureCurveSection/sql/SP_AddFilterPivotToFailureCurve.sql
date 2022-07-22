/****** Object:  StoredProcedure [dbo].[AddFilterPivotToFailureCurve]    Script Date: 7/20/2022 11:44:10 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[AddFilterPivotToFailureCurve]
	@PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotScopeValue /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@PivotOperator /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@PivotKey /*parameter name*/ nvarchar(255) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELPivotScope(PivotScopeID,PivotScopeValue,PivotOperator,PivotKey) VALUES(@PivotScopeID,@PivotScopeValue,@PivotOperator,@PivotKey)
GO


