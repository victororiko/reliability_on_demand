/****** Object:  UserDefinedFunction [dbo].[RIODGetFilteredPopulation]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetFilteredPopulation]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'

CREATE FUNCTION [dbo].[RIODGetFilteredPopulation]
(
	@BuildNumber nvarchar(32) = ''ALL'',
	@RevisionNumber nvarchar(32) = ''ALL'',
	@BuildBranch nvarchar(128) = ''ALL'',
	@OEMName nvarchar(128) = ''ALL'',
	@OEMModel nvarchar(128) = ''ALL'',
	@FlightRing nvarchar(128) = ''ALL'',
	@DeviceFamily nvarchar(128) = ''ALL'',
	@OSSKU nvarchar(128) = ''ALL'',
	@WPId nvarchar(128) = ''ALL'',
	@OSArchitecture nvarchar(128) = ''ALL'',
	@ProcessorModel nvarchar(128) = ''ALL''
)
RETURNS TABLE
AS
RETURN(
	SELECT *,
	dbo.OSVersionToBuildNumber(OSVersion) AS BuildNumber,
	dbo.OSVersionToRevisionNumber(OSVersion) AS RevisionNumber
	FROM
		[dbo].[RELDistinctDevices]
	WHERE 
		(@BuildNumber = ''ALL'' OR OSVersion like ''10.0.'' + @BuildNumber + ''.%'')
		AND
		(@RevisionNumber = ''ALL'' OR OSVersion like ''10.0.'' + @BuildNumber + ''.'' + @RevisionNumber)
		AND
		(@BuildBranch = ''ALL'' OR BuildBranch = @BuildBranch)
		AND
		(@OEMName = ''ALL'' OR OEMName = @OEMName)
		AND
		(@OEMModel = ''ALL'' OR OEMModel = @OEMModel)
		AND
		(@FlightRing = ''ALL'' OR FlightRing = @FlightRing)
		AND
		(@DeviceFamily = ''ALL'' OR DeviceFamily = @DeviceFamily)
		AND
		(@WPId = ''ALL'' OR CAST(WPId AS nvarchar(32)) = @WPId)
		AND
		(@OSSKU = ''ALL'' OR OSSKU = @OSSKU)
		AND
		(@OSArchitecture = ''ALL'' OR OSArchitecture = @OSArchitecture)
		AND
		(@ProcessorModel = ''ALL'' OR ProcessorModel = @ProcessorModel)
	)
' 
END
GO
