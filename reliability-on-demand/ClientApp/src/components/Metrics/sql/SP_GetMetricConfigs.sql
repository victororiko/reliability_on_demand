IF EXISTS (
    SELECT
        *
    FROM
        INFORMATION_SCHEMA.ROUTINES
    WHERE
        SPECIFIC_SCHEMA = N'dbo'
        AND SPECIFIC_NAME = N'GetMetricConfigs'
) DROP PROCEDURE dbo.GetMetricConfigs
GO

CREATE PROCEDURE dbo.GetMetricConfigs
    @StudyConfigID /*parameter name*/ int/*datatype_for_param1*/= -1
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RELMetricConfig
WHERE StudyConfigID = @StudyConfigID
FOR JSON AUTO, Include_Null_Values
    go
GO