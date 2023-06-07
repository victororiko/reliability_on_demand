
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_AddTeam
    @OwnerContact /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerContact provided' /*default value*/,
    @OwnerTeamFriendlyName /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTeamFriendlyName provided' /*default value*/,
    @OwnerTriageAlias /*parameter name*/ nvarchar(255) /*datatype*/ = 'no OwnerTriageAlias provided'/*default value*/,
    @ComputeResourceLocation/*parameter name*/ nvarchar(255) /*datatype*/ = 'no ComputeResourceLocation provided'/*default value*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
INSERT INTO [dbo].[RELTeamConfig]
    (-- columns to insert data into
    OwnerContact,
    OwnerTeamFriendlyName,
    OwnerTriageAlias,
    ComputeResourceLocation,
    HashString
    )
VALUES

( -- values
        @OwnerContact, 
        @OwnerTeamFriendlyName, 
        @OwnerTriageAlias, 
        @ComputeResourceLocation, 
        @OwnerTeamFriendlyName
-- HashString 
)
