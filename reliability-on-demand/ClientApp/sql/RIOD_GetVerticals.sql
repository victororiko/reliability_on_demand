
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetVerticals]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELFailureVertical
FOR JSON AUTO, Include_Null_Values
