-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_GetStudyConfigIDsForPivotsAndScopes
    @PivotKey varchar(255),
    @AggregateBy bit
-- add more stored procedure parameters here
AS
-- body of the stored procedure
select 
pc.PivotKey,
scope.PivotOperator,
scope.PivotScopeValue,
pc.PivotScopeOperator,
pc.PivotScopeID,
pc.AggregateBy,
study.*
from RELStudyPivotConfig as pc
left outer join RELPivotScope as scope 
on pc.PivotScopeID = scope.PivotScopeID
inner join RELStudyConfig as study
on pc.StudyConfigID = study.StudyConfigID
where pc.PivotKey like @PivotKey and pc.AggregateBy = @AggregateBy
FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
