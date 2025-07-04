/****** Object:  StoredProcedure [dbo].[AddOrUpdatePivotConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddOrUpdatePivotConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[AddOrUpdatePivotConfig] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[AddOrUpdatePivotConfig]
    @StudyConfigID int,
    @PivotKey varchar(255),
    @AggregateBy bit,
    @PivotSourceSubType nvarchar(255) = 'AllMode',
    @PivotScopeOperator varchar(5) = '',
    @PivotScopeID int = -1
AS
IF EXISTS(
    -- Select rows from a Table or View 'RELStudyPivotConfig' in schema 'dbo'
    SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotKey = @PivotKey 
AND StudyConfigID = @StudyConfigID
AND PivotScopeID = @PivotScopeID
)
-- Update existing pivot config
EXECUTE dbo.UpdatePivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
-- Else Add the new pivot config
ELSE EXECUTE dbo.AddPivotConfig 
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
GO
