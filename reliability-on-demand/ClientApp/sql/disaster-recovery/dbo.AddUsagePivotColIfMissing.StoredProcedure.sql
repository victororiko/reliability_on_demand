/****** Object:  StoredProcedure [dbo].[AddUsagePivotColIfMissing]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddUsagePivotColIfMissing]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[AddUsagePivotColIfMissing] AS' 
END
GO
    ALTER PROCEDURE [dbo].[AddUsagePivotColIfMissing] @PivotKey varchar(255) = null,
    @PivotScopeID int = -1,
    @StudyConfigID int = -1 AS -- body of the stored procedure
    IF NOT EXISTS(
        SELECT PivotKey,
            PivotScopeID,
            StudyConfigID
        FROM dbo.RELStudyPivotConfig
        WHERE PivotKey = @PivotKey
            AND StudyConfigID = @StudyConfigID
            AND PivotScopeID = @PivotScopeID
    ) -- check if this row alrady exists
    -- Add this row only if it doesn't exist
    EXECUTE AddPivotConfig @StudyConfigID = @StudyConfigID,
    @PivotKey = @PivotKey,
    @AggregateBy = 0,
    @PivotSourceSubType = 'AllMode',
    @PivotScopeOperator = '',
    @PivotScopeID = @PivotScopeID;
GO
