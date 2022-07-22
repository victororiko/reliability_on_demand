/****** Object:  StoredProcedure [dbo].[DeletePivotScopeEnteries]    Script Date: 7/21/2022 10:13:45 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





ALTER PROCEDURE [dbo].[DeletePivotScopeEnteries]
    @PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELPivotScope WHERE PivotScopeID = @PivotScopeID
GO


