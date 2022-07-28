/****** Object:  StoredProcedure [dbo].[GetAllScopeForPivotKeys]    Script Date: 7/18/2022 1:48:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








ALTER PROCEDURE [dbo].[GetAllScopeForPivotKeys]
    @PivotKeys /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/,
	@StudyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT info.PivotName,info.UIInputDataType,scope.PivotKey,scope.PivotScopeID,scope.PivotScopeValue,config.PivotScopeOperator
	FROM RELPivotScope AS scope
	INNER JOIN RELPivotInfo AS info
	ON scope.PivotKey = info.PivotKey
	INNER JOIN RELStudyPivotConfig AS config
	ON scope.PivotKey = config.PivotKey
	WHERE scope.PivotKey IN (@PivotKeys) AND config.StudyID = @StudyID AND config.PivotScopeID IS NOT NULL
	FOR JSON AUTO, Include_Null_Values
GO