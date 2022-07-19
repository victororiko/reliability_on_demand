/****** Object:  StoredProcedure [dbo].[GetAllConfiguredFailurePivotsForAVertical]    Script Date: 7/13/2022 2:16:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAllConfiguredFailurePivotsForAVertical]
    @sourcesubtype /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT
    info.PivotID,
    info.PivotSourceColumnName, 
    info.UIInputDataType, 
    info.PivotKey, 
    smap.IsApportionColumn, 
    smap.IsApportionJoinColumn, 
    smap.IsKeyColumn, 
    smap.IsSelectColumn, 
    smap.PivotScopeID, 
    scope.PivotScopeValue, 
    scope.PivotOperator
FROM RELPivotInfo AS info 
    INNER JOIN RELStudyPivotConfig AS smap ON info.PivotKey = smap.PivotKey 
    INNER JOIN RELPivotSourceMap AS map ON map.PivotSource = info.PivotSource 
    LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID
WHERE smap.StudyConfigID = @StudyConfigID AND map.PivotSourceType LIKE 'Failure%' AND smap.PivotSourceSubType LIKE @sourcesubtype
FOR JSON AUTO, Include_Null_Values
GO
