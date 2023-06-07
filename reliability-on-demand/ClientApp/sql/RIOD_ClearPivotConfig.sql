-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.RIOD_ClearPivotConfig
    @StudyConfigID /*parameter name*/ int /*datatype*/,
    @PivotKey /*parameter name*/ varchar(255) /*datatype*/
-- add more stored procedure parameters here
AS
    -- Delete rows from table 'RELStudyPivotConfig'
    DELETE FROM RELStudyPivotConfig
    WHERE StudyConfigID = @StudyConfigID AND PivotKey = @PivotKey
