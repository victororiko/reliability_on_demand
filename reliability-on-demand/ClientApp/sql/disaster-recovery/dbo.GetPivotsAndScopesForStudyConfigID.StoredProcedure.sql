/****** Object:  StoredProcedure [dbo].[GetPivotsAndScopesForStudyConfigID]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetPivotsAndScopesForStudyConfigID]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetPivotsAndScopesForStudyConfigID] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetPivotsAndScopesForStudyConfigID]
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
GO
