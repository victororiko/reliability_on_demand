
CREATE PROCEDURE dbo.RIOD_GetMetricConfigs
    @StudyConfigID /*parameter name*/ int/*datatype_for_param1*/= -1
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RELMetricConfig
WHERE StudyConfigID = @StudyConfigID
FOR JSON AUTO, Include_Null_Values
