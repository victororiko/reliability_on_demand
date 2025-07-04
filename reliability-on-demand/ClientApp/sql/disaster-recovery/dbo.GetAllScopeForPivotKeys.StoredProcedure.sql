/****** Object:  StoredProcedure [dbo].[GetAllScopeForPivotKeys]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetAllScopeForPivotKeys]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetAllScopeForPivotKeys] AS' 
END
GO








ALTER PROCEDURE [dbo].[GetAllScopeForPivotKeys]
    @PivotKeys /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/,
	@StudyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT info.PivotName,info.UIInputDataType,scope.PivotKey,scope.PivotScopeID,scope.PivotScopeValue,scope.PivotOperator,config.PivotScopeOperator
	FROM RELPivotScope AS scope
	INNER JOIN RELPivotInfo AS info
	ON scope.PivotKey = info.PivotKey
	INNER JOIN RELStudyPivotConfig AS config
	ON scope.PivotKey = config.PivotKey
	WHERE scope.PivotKey IN (@PivotKeys) AND config.StudyID = @StudyID AND config.PivotScopeID IS NOT NULL
	FOR JSON AUTO, Include_Null_Values
GO
