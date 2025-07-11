/****** Object:  StoredProcedure [dbo].[RIOD_AddTeam]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_AddTeam]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_AddTeam] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_AddTeam]
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
GO
