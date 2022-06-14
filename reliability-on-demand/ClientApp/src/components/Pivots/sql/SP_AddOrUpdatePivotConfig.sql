-- Create a new stored procedure called 'AddOrUpdatePivotConfig' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'AddOrUpdatePivotConfig'
)
DROP PROCEDURE dbo.AddOrUpdatePivotConfig
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.AddOrUpdatePivotConfig
    @StudyID /*parameter name*/ int /*datatype*/,
    @PivotID /*parameter name*/ int /*datatype*/,
    @AggregateBy /*parameter name*/ bit /*datatype*/,
    @PivotSourceSubType /*parameter name*/ nvarchar(255) /*datatype*/ = 'no PivotSourceSubType provided'/*default value*/
-- Update more stored procedure parameters here
AS
-- Get AggregateBy value first
DECLARE @PrevAggregateBy BIT;
SELECT @PrevAggregateBy = AggregateBy FROM RELStudyPivotConfig
WHERE PivotId = @PivotID;
-- If AggregateBy has been set update the existing pivot config
IF @PrevAggregateBy = 1
    EXECUTE dbo.UpdatePivotConfig 
        @StudyID,
        @PivotID,
        @AggregateBy,
        @PivotSourceSubType
-- Else Add the new pivot config
ELSE EXECUTE dbo.AddPivotConfig 
        @StudyID,
        @PivotID,
        @AggregateBy,
        @PivotSourceSubType
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.AddOrUpdatePivotConfig 
    @StudyID = 1,
    @PivotID = 150,
    @AggregateBy = 1 ,
    @PivotSourceSubType = 'AllMode'
GO
-- check if the pivot is Updated 
SELECT *
FROM RELStudyPivotConfig
WHERE PivotID = 150
GO
-- get pivot info
SELECT *
FROM RELPivotInfo
WHERE PivotID = 150
GO

--delete from RELStudyPivotConfig where PivotID = 150