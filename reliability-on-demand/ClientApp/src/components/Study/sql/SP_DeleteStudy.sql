/****** Object:  StoredProcedure [dbo].[DeleteStudy]    Script Date: 1/19/2023 11:41:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[DeleteStudy]
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
    DELETE FROM RELStudyConfig 
    WHERE StudyName = @StudyName AND 
    LastRefreshDate = @LastRefreshDate AND
    CacheFrequency = @CacheFrequency AND 
    Expiry = @Expiry AND
    ObservationWindowDays=@ObservationWindowDays AND
	StudyType = @StudyType
