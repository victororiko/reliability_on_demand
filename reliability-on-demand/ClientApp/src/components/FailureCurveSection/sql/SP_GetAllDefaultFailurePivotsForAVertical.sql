/****** Object:  StoredProcedure [dbo].[GetAllDefaultFailurePivotsForAVertical]    Script Date: 8/10/2022 2:58:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetAllDefaultFailurePivotsForAVertical]
	@sourcesubtype /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	WITH defaultpivots AS(
    SELECT info.PivotID,info.PivotName,info.UIInputDataType,info.PivotKey
	,smap.IsSelectColumn,smap.IsKeyColumn,smap.IsApportionColumn,smap.IsApportionJoinColumn
	,smap.PivotScopeID,smap.PivotScopeOperator,scope.PivotScopeValue,scope.PivotOperator 
	FROM RELStudyPivotConfig AS smap INNER JOIN RELPivotInfo AS info 
	ON smap.PivotKey = info.PivotKey INNER JOIN RELPivotSourceMap AS map 
	ON info.PivotSource = map.PivotSource LEFT OUTER JOIN RELPivotScope AS scope 
	ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.PivotSourceSubType LIKE @sourcesubtype 
	AND map.PivotSourceType LIKE 'Failure%' AND smap.StudyConfigID = -1)
	SELECT * FROM defaultpivots
	FOR JSON AUTO, Include_Null_Values
GO