/****** Object:  StoredProcedure [dbo].[UpdatePivotConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpdatePivotConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[UpdatePivotConfig] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[UpdatePivotConfig]
    @StudyConfigID int,
    @PivotKey varchar(255),
    @AggregateBy bit,
    @PivotSourceSubType nvarchar(255) = 'no PivotSourceSubType provided',
    @PivotScopeOperator varchar(5) = '',
    @PivotScopeID int = -1
AS
-- Delete rows from table 'RELStudyPivotCofig'
DELETE FROM RELStudyPivotConfig
WHERE StudyConfigID = @StudyConfigID
    AND PivotKey = @PivotKey
    AND PivotScopeID = @PivotScopeID
-- Add a new row with new PivotScopeID
EXECUTE AddPivotConfig
        @StudyConfigID,
        @PivotKey,
        @AggregateBy,
        @PivotSourceSubType,
        @PivotScopeOperator,
        @PivotScopeID
GO
