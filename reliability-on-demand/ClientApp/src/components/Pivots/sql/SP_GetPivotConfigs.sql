-- User configured Metric Config
-- Create a new stored procedure called 'GetUserPivotConfigs' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES

WHERE SPECIFIC_SCHEMA
= N'dbo'
    AND SPECIFIC_NAME = N'GetUserPivotConfigs'
)
DROP PROCEDURE dbo.GetUserPivotConfigs
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetUserPivotConfigs
    @PivotSource /*parameter name*/ varchar(255) /*datatype_for_param1*/,
    @StudyID int
-- add more stored procedure parameters here
AS
-- body of the stored procedure
select 
[dbo].[RELStudyPivotConfig].*, 
        [dbo].[RELPivotInfo].PivotName,
        [dbo].[RELPivotInfo].PivotSource,
        [dbo].[RELPivotInfo].PivotKey
from [dbo].[RELStudyPivotConfig]
inner join [dbo].[RELPivotInfo]
on [dbo].[RELStudyPivotConfig].PivotID = [dbo].[RELPivotInfo].PivotID
where PivotSource = @PivotSource and StudyID = @StudyID
FOR JSON AUTO, Include_Null_Values
    go
GO

-- Example
EXECUTE GetUserPivotConfigs 'DeviceCensusConsolidated.ss',1
