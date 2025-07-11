/****** Object:  StoredProcedure [dbo].[GetUserPivotConfigs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetUserPivotConfigs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetUserPivotConfigs] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetUserPivotConfigs]
    @PivotSource /*parameter name*/ varchar(255) /*datatype_for_param1*/,
    @StudyConfigID int
-- add more stored procedure parameters here
AS
DECLARE @StudyConfigIDtoUse INT;
-- get previously configured user configs if they exixts
IF EXISTS(
    SELECT *
FROM RELStudyPivotConfig
WHERE PivotKey LIKE @PivotSource + '%' and StudyConfigID = @StudyConfigID
)
SET @StudyConfigIDtoUse = @StudyConfigID
ELSE SET @StudyConfigIDtoUse = -1
SELECT * FROM(
    SELECT
        [dbo].[RELStudyPivotConfig].*,
        [dbo].[RELPivotInfo].PivotName,
        [dbo].[RELPivotInfo].PivotSource,
		[dbo].[RELPivotInfo].UIInputDataType AS UIDataType
    FROM [dbo].[RELStudyPivotConfig]
        INNER JOIN [dbo].[RELPivotInfo]
        ON [dbo].[RELStudyPivotConfig].PivotKey = [dbo].[RELPivotInfo].PivotKey
    WHERE PivotSource = @PivotSource and StudyConfigID = @StudyConfigIDtoUse) AS ans
    FOR JSON AUTO, Include_Null_Values
GO
