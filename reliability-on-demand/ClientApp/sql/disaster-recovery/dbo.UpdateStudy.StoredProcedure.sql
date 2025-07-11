/****** Object:  StoredProcedure [dbo].[UpdateStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpdateStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[UpdateStudy] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[UpdateStudy]
    @StudyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no study name' /*default value*/,
	@LastRefreshDate /*parameter name*/ datetime /*datatype*/ = null /*default value*/, 
	@CacheFrequency /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@Expiry /*parameter name*/ datetime /*datatype*/ = null /*default value*/,
	@ObservationWindowDays /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyType /*parameter name*/ nvarchar(255) /*datatype*/ = 'OS' /*default value*/,
	@TeamID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    UPDATE RELStudyConfig 
	SET StudyName = @StudyName, 
	LastRefreshDate = @LastRefreshDate,
	CacheFrequency = @CacheFrequency, 
	Expiry = @Expiry,
	ObservationWindowDays=@ObservationWindowDays, 
	StudyType=@StudyType 
	WHERE StudyConfigID =@StudyConfigID and TeamID = @TeamID
GO
