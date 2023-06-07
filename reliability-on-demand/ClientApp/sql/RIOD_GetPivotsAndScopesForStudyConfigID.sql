-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_GetPivotsAndScopesForStudyConfigID
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
