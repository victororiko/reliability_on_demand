-- Create a new stored procedure called 'ClearPivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'ClearPivotConfig'
)
DROP PROCEDURE dbo.ClearPivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.ClearPivotConfig
    @StudyID /*parameter name*/ int /*datatype*/,
    @PivotID /*parameter name*/ int /*datatype*/
-- add more stored procedure parameters here
AS
    -- Delete rows from table 'RELStudyPivotConfig'
    DELETE FROM RELStudyPivotConfig
    WHERE StudyID = @StudyID AND PivotID = @PivotID
    GO
GO

-- example to execute the stored procedure we just created
EXECUTE dbo.AddPivotConfig 
    @StudyID = 1,
    @PivotID = 150,
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
GO

-- check if the pivot is added 
SELECT * FROM RELStudyPivotConfig
WHERE PivotID = 150 AND StudyID = 1	 
GO 
-- delete newly added pivot config
EXECUTE dbo.ClearPivotConfig
    @StudyID = 1,
    @PivotID = 150
GO
-- check if the pivot is deleted
SELECT * FROM RELStudyPivotConfig
WHERE PivotID = 150 AND StudyID = 1	 
GO 