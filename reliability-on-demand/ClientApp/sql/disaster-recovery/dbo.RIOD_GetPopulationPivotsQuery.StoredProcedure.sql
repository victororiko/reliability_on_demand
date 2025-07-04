/****** Object:  StoredProcedure [dbo].[RIOD_GetPopulationPivotsQuery]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetPopulationPivotsQuery]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetPopulationPivotsQuery] AS' 
END
GO
-- =============================================
-- Author:      Karan Daftary
-- Create Date: 6/2/2023
-- Description: Gets Population Pivots across all study configs
-- =============================================
ALTER PROCEDURE [dbo].[RIOD_GetPopulationPivotsQuery]
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    -- Insert statements for procedure here
    SELECT
    config.PivotKey,
    config.StudyConfigID,
    config.PivotScopeOperator as RelationalOperator,
    infomap.PivotSourceType,
    infomap.PivotSource as Source,
    infomap.PivotSourceViewPath as ViewSourcePath,
    infomap.PivotSourcePath as SourcePath,
    info.UIInputDataType,
    info.PivotSourceColumnName as SelectColumn,
    config.AggregateBy,
    scope.PivotScopeID,
    scope.PivotOperator,
    scope.PivotScopeValue,
	stype.PopulationJoinKeyExpressionCols
FROM
    RELPivotInfo AS info
    INNER JOIN RELPivotSourceMap AS infomap ON info.PivotSource = infomap.PivotSource
    INNER JOIN RELStudyPivotConfig AS config ON info.PivotKey = config.PivotKey
    LEFT OUTER JOIN RELPivotScope AS scope ON scope.PivotScopeID = config.PivotScopeID
	INNER JOIN RELStudyConfig AS study ON config.StudyConfigID = study.StudyConfigID 
	INNER JOIN RELStudyType AS stype ON study.StudyType = stype.StudyType 
WHERE
    (
        (config.AggregateBy = 1)
        OR (scope.PivotScopeID IS NOT NULL)
    )
    AND (infomap.PivotSourceType LIKE 'Population%')
	AND study.StudyConfigID != -1
ORDER BY
    Source
END
GO
