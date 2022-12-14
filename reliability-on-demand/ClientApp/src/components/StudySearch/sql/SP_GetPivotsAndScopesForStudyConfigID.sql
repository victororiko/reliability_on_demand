-- Create a new stored procedure called 'GetPivotsAndScopesForStudyConfigID' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'GetPivotsAndScopesForStudyConfigID'
)
DROP PROCEDURE dbo.GetPivotsAndScopesForStudyConfigID
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetPivotsAndScopesForStudyConfigID
    @StudyConfigID int = -1
-- add more stored procedure parameters here
AS
-- body of the stored procedure
select
 pc.PivotKey,
dbo.GetPivotName(pc.PivotKey) as PivotName,
pc.AggregateBy,
pc.PivotScopeOperator,
scope.PivotOperator as PivotOperator,
scope.PivotScopeValue as PivotScopeValue
from RELStudyPivotConfig as pc 
left outer join RELPivotScope as scope
on pc.PivotScopeID = scope.PivotScopeID
where pc.StudyConfigID = @StudyConfigID
FOR JSON PATH 
go
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.GetPivotsAndScopesForStudyConfigID 7
GO