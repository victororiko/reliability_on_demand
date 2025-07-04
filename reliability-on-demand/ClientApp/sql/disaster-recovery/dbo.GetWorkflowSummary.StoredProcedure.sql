/****** Object:  StoredProcedure [dbo].[GetWorkflowSummary]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetWorkflowSummary]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetWorkflowSummary] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetWorkflowSummary]
    @Started /*parameter name*/ DATETIME /*datatype*/ = '7/29/2021' /*default value*/,
	@Finished/*parameter name*/ DATETIME /*datatype*/ = GETDATE /*default value*/ 
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
SELECT 
	COUNT(CASE WHEN Status = 'Failed' THEN 1 END) AS Failed, 
	COUNT(CASE WHEN Status = 'Successful' THEN 1 END) AS Successful,
	COUNT(Status) AS Total,
	AVG(Duration) AS avg_duration_mins,
	WorkflowName
FROM (SELECT
			*,
			DATEDIFF(minute, Started, Finished) AS Duration
		FROM XflowMetadata
		WHERE Started >= @Started AND Finished <= @Finished) AS mytable
GROUP BY WorkflowName
;
GO
