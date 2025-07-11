/****** Object:  StoredProcedure [dbo].[RIOD_GetConfiguredMetricsForAStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetConfiguredMetricsForAStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetConfiguredMetricsForAStudy] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetConfiguredMetricsForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT * FROM(
SELECT MetricName,Vertical,PivotName 
FROM RELMetricConfig AS mconfig
INNER JOIN
RELPivotInfo AS info
ON info.PivotKey = mconfig.PivotKey
WHERE StudyConfigID = @StudyConfigID) AS ans
FOR JSON AUTO;
GO
