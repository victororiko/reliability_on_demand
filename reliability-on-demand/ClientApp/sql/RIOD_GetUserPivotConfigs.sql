
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetUserPivotConfigs]
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
