
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_GetPopulationPivots
    @PivotSource /*parameter name*/ varchar(255) /*datatype_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT * FROM [dbo].[RELPivotInfo] -- to get pivot info
WHERE PivotSource = @PivotSource
FOR JSON AUTO, Include_Null_Values
