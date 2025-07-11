/****** Object:  StoredProcedure [dbo].[GetJSONAllScopeForPivotKeys]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetJSONAllScopeForPivotKeys]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetJSONAllScopeForPivotKeys] AS' 
END
GO








ALTER PROCEDURE [dbo].[GetJSONAllScopeForPivotKeys]
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
GO
