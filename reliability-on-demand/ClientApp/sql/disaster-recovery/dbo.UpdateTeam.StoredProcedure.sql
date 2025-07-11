/****** Object:  StoredProcedure [dbo].[UpdateTeam]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpdateTeam]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[UpdateTeam] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[UpdateTeam]
    @OwnerContact /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerContact provided' /*default value*/,
    @OwnerTeamFriendlyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTeamFriendlyName provided' /*default value*/,
    @OwnerTriageAlias /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTriageAlias provided' /*default value*/,
    @ComputeResourceLocation /*parameter name*/ nvarchar(255) /*datatype*/ = 'no ComputeResourceLocation provided' /*default value*/,
    @TeamID /*parameter name*/ int /*datatype*/ = -1
/*default value*/
AS
-- body of the stored procedure
UPDATE [dbo].[RELTeamConfig] 
SET 
    OwnerContact = @OwnerContact, 
    OwnerTeamFriendlyName = @OwnerTeamFriendlyName,
    OwnerTriageAlias = @OwnerTriageAlias,
    ComputeResourceLocation = @ComputeResourceLocation,
    HashString = @OwnerTeamFriendlyName 
WHERE TeamID =@TeamID
GO
