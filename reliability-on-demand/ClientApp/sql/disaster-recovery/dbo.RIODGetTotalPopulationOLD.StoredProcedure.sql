/****** Object:  StoredProcedure [dbo].[RIODGetTotalPopulationOLD]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetTotalPopulationOLD]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODGetTotalPopulationOLD] AS' 
END
GO
ALTER PROCEDURE [dbo].[RIODGetTotalPopulationOLD]
(
    -- Pivot paramteres
    @MinBuild int = 0,
    @MaxBuild int = 1000000,
    @MinRevision int = 0,
    @MaxRevision int = 1000000,
    @Rings nvarchar(256) = 'ALL',
    @Branches nvarchar(256) = 'ALL',
    @OEMs nvarchar(256) = 'ALL',
    @OEMModels nvarchar(256) = 'ALL',
    @WPIDs nvarchar(256) = 'ALL',
    @DeviceFamilies nvarchar(256) = 'ALL',
    @OSSKUs nvarchar(256) = 'ALL',
    @OSArchitectures nvarchar(256) = 'ALL',
    @ProcessorModels nvarchar(256) = 'ALL'
)
AS
BEGIN
	SELECT count(*) AS TotalDevices
	FROM 
		(
		SELECT distinct OSVersion, DeviceId
		FROM RIODGetPopulationWithFailures(
			@MinBuild,
			@MaxBuild,
			@MinRevision,
			@MaxRevision,
			@Rings,
			@Branches,
			@OEMs,
			@OEMModels,
			@WPIDs,
			@DeviceFamilies,
			@OSSKUs,
			@OSArchitectures,
			@ProcessorModels,
			-- Study Vertical(s)
			'ALL'
		)
	) AS AllDevices
END
GO
