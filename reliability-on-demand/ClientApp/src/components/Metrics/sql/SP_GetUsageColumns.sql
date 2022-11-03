CREATE PROCEDURE dbo.GetUsageColumns
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RELPivotSourceUsageUnitMap
FOR JSON AUTO, Include_Null_Values
    go
GO