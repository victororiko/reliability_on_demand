/****** Object:  StoredProcedure [dbo].[DeleteUsagePivotColIfExists]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeleteUsagePivotColIfExists]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[DeleteUsagePivotColIfExists] AS' 
END
GO
    ALTER PROCEDURE [dbo].[DeleteUsagePivotColIfExists] 
    @PivotKey varchar(255) = null,
    @PivotScopeID int = -1,
    @StudyConfigID int = -1 AS -- body of the stored procedure
    IF EXISTS(
        SELECT PivotKey,
            PivotScopeID,
            StudyConfigID
        FROM dbo.RELStudyPivotConfig
        WHERE PivotKey = @PivotKey
            AND StudyConfigID = @StudyConfigID
            AND PivotScopeID = @PivotScopeID
    ) -- check if this row alrady exists
    -- Delete it
    DELETE FROM RELStudyPivotConfig
    WHERE StudyConfigID = @StudyConfigID 
        AND PivotKey = @PivotKey
        AND PivotScopeID = @PivotScopeID;
GO
