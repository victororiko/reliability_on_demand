/****** Object:  StoredProcedure [dbo].[RIODGetTotalPopulation]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetTotalPopulation]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODGetTotalPopulation] AS' 
END
GO

ALTER PROCEDURE [dbo].[RIODGetTotalPopulation]
(
	@AggregatedPivots nvarchar(512) = ''
)
AS
BEGIN
	select count(*) as TotalMachineCount,
	(CASE
	WHEN @AggregatedPivots like '%OSVersion%' THEN OSVersion
	ELSE 'ALL'
	END) AS OSVersion,
	(CASE
	WHEN @AggregatedPivots like '%BuildBranch%' THEN BuildBranch
	ELSE 'ALL'
	END) AS BuildBranch,
	(CASE
	WHEN @AggregatedPivots like '%OEMName%' THEN OEMName
	ELSE 'ALL'
	END) AS OEMName,
	(CASE
	WHEN @AggregatedPivots like '%OEMModel%' THEN OEMModel
	ELSE 'ALL'
	END) AS OEMModel,
	(CASE
	WHEN @AggregatedPivots like '%FlightRing%' THEN FlightRing
	ELSE 'ALL'
	END) AS FlightRing,
	(CASE
	WHEN @AggregatedPivots like '%DeviceFamily%' THEN DeviceFamily
	ELSE 'ALL'
	END) AS DeviceFamily,
	(CASE
	WHEN @AggregatedPivots like '%OSSKU%' THEN OSSKU
	ELSE 'ALL'
	END) AS OSSKU,
	(CASE
	WHEN @AggregatedPivots like '%OSArchitecture%' THEN OSArchitecture
	ELSE 'ALL'
	END) AS OSArchitecture
	from [dbo].[RELDistinctDevices]
		GROUP BY
			(CASE
			WHEN @AggregatedPivots like '%OSVersion%' THEN OSVersion
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%BuildBranch%' THEN BuildBranch
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%OEMName%' THEN OEMName
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%OEMModel%' THEN OEMModel
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%FlightRing%' THEN FlightRing
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%DeviceFamily%' THEN DeviceFamily
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%OSSKU%' THEN OSSKU
			ELSE 'ALL'
			END),
			(CASE
			WHEN @AggregatedPivots like '%OSArchitecture%' THEN OSArchitecture
			ELSE 'ALL'
			END)
END
GO
