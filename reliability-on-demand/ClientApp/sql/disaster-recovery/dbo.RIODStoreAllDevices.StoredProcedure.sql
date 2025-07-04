/****** Object:  StoredProcedure [dbo].[RIODStoreAllDevices]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODStoreAllDevices]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODStoreAllDevices] AS' 
END
GO
ALTER PROCEDURE [dbo].[RIODStoreAllDevices]
AS
BEGIN

	INSERT INTO [dbo].[RELDistinctDevices]
	SELECT *
	FROM 
	(
		(
		select distinct DeviceId,
						OSVersion,
						BuildBranch,
						OEMName,
						OEMModel,
						FlightRing,
						WPId,
						_DeviceFamily as DeviceFamily,
						NULL as OSSKU,
						OSArchitecture,
						ProcessorModel
			from CensusDevices
			where 
			BuildNumber >= 20200
			AND BuildBranch='rs_prerelease'
		)
		union
		(
		select distinct DeviceId,
						OSVersion,
						BuildBranch,
						OEMName,
						OEMModel,
						FlightRing,
						WPId,
						'Windows.Desktop' as DeviceFamily,
						NULL as OSSKU,
						OSArchitecture,
						ProcessorModel
			from WatsonDeviceFailures
			where OSVersion like '10.0.20%'
			AND BuildBranch='rs_prerelease'
		)
		union
		(
		select distinct DeviceId,
						OSVersion,
						BuildBranch,
						OEMName,
						OEMModel,
						FlightRing,
						WPId,
						'Windows.Desktop' as DeviceFamily,
						NULL as OSSKU,
						OSArchitecture,
						ProcessorModel
			from KernelDeviceFailures
			where OSVersion like '10.0.20%'
			AND BuildBranch='rs_prerelease'
		)
	) as AllDevices
END
GO
