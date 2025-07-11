/****** Object:  StoredProcedure [dbo].[RIOD_GetStudyConfigIDsForPivotsAndScopes]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetStudyConfigIDsForPivotsAndScopes]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetStudyConfigIDsForPivotsAndScopes] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetStudyConfigIDsForPivotsAndScopes]
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
GO
