/****** Object:  StoredProcedure [dbo].[RIODGetStudyPivots]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetStudyPivots]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODGetStudyPivots] AS' 
END
GO
ALTER PROCEDURE [dbo].[RIODGetStudyPivots]
(
    -- Pivot paramteres
    @StudyID uniqueidentifier
)
AS
BEGIN
    SELECT P.PivotName, P.AggregateByPivot, P.ScopeValue
	FROM 
		RELUnifiedStudy AS S JOIN
		RELStudy_PivotScope AS R ON S.StudyID = R.StudyId JOIN
		RELPivotScope AS P ON P.PivotScopeID = R.PivotScopeID
	WHERE
		S.StudyID = @StudyID
END
GO
