

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_DeleteTeam]
    @TeamID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    DELETE RELTeamConfig WHERE TeamID = @TeamID
