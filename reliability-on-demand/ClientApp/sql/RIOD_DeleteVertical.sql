



CREATE PROCEDURE [dbo].[RIOD_DeleteVertical]
	@VerticalName /*parameter name*/ varchar(96) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	DELETE FROM RELFailureVertical WHERE HashString = @VerticalName
