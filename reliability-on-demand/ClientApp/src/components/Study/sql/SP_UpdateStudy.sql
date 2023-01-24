/****** Object:  StoredProcedure [dbo].[UpdateStudy]    Script Date: 1/19/2023 11:50:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[UpdateStudy]
    @StudyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no study name' /*default value*/,
	@LastRefreshDate /*parameter name*/ datetime /*datatype*/ = null /*default value*/, 
	@CacheFrequency /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@Expiry /*parameter name*/ datetime /*datatype*/ = null /*default value*/,
	@ObservationWindowDays /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyConfigID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyType /*parameter name*/ nvarchar(255) /*datatype*/ = 'OS' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    UPDATE RELStudyConfig SET StudyName = @StudyName, LastRefreshDate = @LastRefreshDate,CacheFrequency = @CacheFrequency, Expiry = @Expiry,ObservationWindowDays=@ObservationWindowDays, StudyType=@StudyType WHERE StudyConfigID =@StudyConfigID
