/****** Object:  StoredProcedure [dbo].[GetMaximumPivotScopeCount]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetMaximumPivotScopeCount]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetMaximumPivotScopeCount] AS' 
END
GO

ALTER PROCEDURE [dbo].[GetMaximumPivotScopeCount]
		@s int output
-- add more stored procedure parameters here
AS
BEGIN
    -- body of the stored procedure
	SELECT max(PivotScopeID) AS max FROM RELPivotScope
END
GO
