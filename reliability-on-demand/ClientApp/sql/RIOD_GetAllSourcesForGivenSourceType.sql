
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetAllSourcesForGivenSourceType]
-- add more stored procedure parameters here
 @SourceType /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
 AS

 IF @SourceType = 'All'
 BEGIN
-- body of the stored procedure
    SELECT * FROM RELPivotSourceMap
    FOR JSON AUTO, Include_Null_Values
END
ELSE
BEGIN
	SELECT * FROM RELPivotSourceMap
	WHERE PivotSourceType = @SourceType
    FOR JSON AUTO, Include_Null_Values
END
