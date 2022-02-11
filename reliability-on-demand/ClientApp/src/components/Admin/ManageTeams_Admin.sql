/****** Object:  StoredProcedure [dbo].[AddTeam]    Script Date: 2/10/2022 2:53:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[AddTeam]
    @OwnerContact /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerContact provided' /*default value*/,
	@OwnerTeamFriendlyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTeamFriendlyName provided' /*default value*/, 
	@OwnerTriageAlias /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTriageAlias provided' /*default value*/,
	@ComputeResourceLocation /*parameter name*/ nvarchar(255) /*datatype*/ = 'no ComputeResourceLocation provided' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO [dbo].[RELTeamConfig]
	VALUES (@OwnerContact, @OwnerTeamFriendlyName, @OwnerTriageAlias, @ComputeResourceLocation)
GO


/****** Object:  StoredProcedure [dbo].[UpdateTeam]    Script Date: 2/10/2022 2:53:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[UpdateTeam]
    @OwnerContact /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerContact provided' /*default value*/,
	@OwnerTeamFriendlyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTeamFriendlyName provided' /*default value*/, 
	@OwnerTriageAlias /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTriageAlias provided' /*default value*/,
	@ComputeResourceLocation /*parameter name*/ nvarchar(255) /*datatype*/ = 'no ComputeResourceLocation provided' /*default value*/,
	@TeamID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    UPDATE RELTeamConfig SET OwnerContact = @OwnerContact, OwnerTeamFriendlyName = @OwnerTeamFriendlyName,OwnerTriageAlias = @OwnerTriageAlias,ComputeResourceLocation=@ComputeResourceLocation WHERE TeamID =@TeamID
GO

/****** Object:  StoredProcedure [dbo].[DeleteTeam]    Script Date: 2/10/2022 2:54:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[DeleteTeam]
    @TeamID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    DELETE RELTeamConfig WHERE TeamID = @TeamID
GO