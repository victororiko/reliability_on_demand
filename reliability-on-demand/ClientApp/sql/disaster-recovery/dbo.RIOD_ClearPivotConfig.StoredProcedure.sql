/****** Object:  StoredProcedure [dbo].[RIOD_ClearPivotConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_ClearPivotConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_ClearPivotConfig] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_ClearPivotConfig]
    @StudyConfigID /*parameter name*/ int /*datatype*/,
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/
-- add more stored procedure parameters here
AS
    -- Delete rows from table 'RELStudyPivotConfig'
    DELETE FROM RELStudyPivotConfig
    WHERE StudyConfigID = @StudyConfigID AND PivotKey = @PivotKey
GO
