
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_UpdateTeam]
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
