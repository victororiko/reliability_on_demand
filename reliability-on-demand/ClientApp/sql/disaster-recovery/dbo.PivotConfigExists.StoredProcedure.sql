/****** Object:  StoredProcedure [dbo].[PivotConfigExists]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PivotConfigExists]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[PivotConfigExists] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[PivotConfigExists]
    @StudyConfigID int,
    @PivotKey varchar(255),
    @PivotScopeID int = -1
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotKey = @PivotKey
    AND StudyConfigID = @StudyConfigID
    AND PivotScopeID = @PivotScopeID
GO
