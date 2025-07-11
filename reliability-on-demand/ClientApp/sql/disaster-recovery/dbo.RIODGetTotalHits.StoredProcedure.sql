/****** Object:  StoredProcedure [dbo].[RIODGetTotalHits]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetTotalHits]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODGetTotalHits] AS' 
END
GO

ALTER PROCEDURE [dbo].[RIODGetTotalHits]
(
	@Verticals nvarchar(256) = 'ALL'
)
AS
BEGIN
	SELECT count(*) AS TotalHits
	FROM 
		(
		SELECT *
		FROM 
			(
			SELECT FailureInfo_FailureHash
			FROM WatsonDeviceFailures
			WHERE @Verticals IS NULL OR @Verticals = 'ALL' OR @Verticals LIKE '%' + Vertical + '%'
			) AS ILoveSQLSyntax
			UNION ALL
			(
			SELECT FailureInfo_FailureHash
			FROM KernelDeviceFailures
			WHERE @Verticals IS NULL OR @Verticals = 'ALL' OR @Verticals LIKE '%' + Vertical + '%'
			)
		) AS AllFailures
END
GO
