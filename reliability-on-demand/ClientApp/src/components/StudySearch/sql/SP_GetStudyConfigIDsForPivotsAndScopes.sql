-- Create a new stored procedure called 'GetStudyConfigIDsForPivotsAndScopes' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'GetStudyConfigIDsForPivotsAndScopes'
)
DROP PROCEDURE dbo.GetStudyConfigIDsForPivotsAndScopes
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetStudyConfigIDsForPivotsAndScopes
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
go
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.GetStudyConfigIDsForPivotsAndScopes 'DeviceCensusConsolidated.ss_OSBranch', 1
GO