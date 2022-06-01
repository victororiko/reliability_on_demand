--Stuff
USE ReliabilityReporting

--- scratch area
select *
from dbo.RELTeamConfig
GO

--- end scratch area

-- adding studies
-- Insert rows into table 'RELStudyConfig'
INSERT INTO RELStudyConfig
( -- columns to insert data into
 StudyName,LastRefreshDate, LastModifiedDate,CacheFrequency,Expiry,TeamID
)
VALUES
( -- first row: values for the columns in the list above
 'Retail Studies - every 3 days','20210218 10:34:09 AM','20210218 10:34:09 AM','72','20210518 10:34:09 AM','3'
)
-- add more rows here
GO

ALTER TABLE [dbo].[RELStudyConfig]
ADD ObservationWindowDays int NOT NULL DEFAULT(14)
GO

SELECT * from dbo.RELStudyConfig



--- lengthy stored procs
-- Create a new stored procedure called 'GetAllStudyConfigsForTeam' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'GetAllStudyConfigsForTeam'
)
DROP PROCEDURE dbo.GetAllStudyConfigsForTeam
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.GetAllStudyConfigsForTeam
    @TeamID /*parameter name*/ int /*datatype_for_TeamID*/ = 0 /*default_value_for_TeamID*/
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT *
    FROM dbo.RELStudyConfig
    WHERE TeamID = @TeamID
    FOR JSON AUTO, Include_Null_Values
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.GetAllStudyConfigsForTeam 0 /*value_for_TeamID*/
GO

-- Examples for adding a new team


EXECUTE dbo.AddTeam 'hello', 'world', 'hello@world.com'
GO

-- Failure Curve scratch
select * from dbo.RELStudyPivotConfig
select * from RELStudyPivotConfigDefault

select distinct(StudyID) from dbo.RELStudyPivotConfig

SELECT VerticalName,PivotSourceSubType FROM [dbo].[RELFailureVertical]


-- GetAllailurePivotNamesForAVertical
SELECT info.PivotID,
info.PivotSourceColumnName,
info.UIInputDataType,
smap.IsApportionColumn,
smap.IsApportionJoinColumn,
smap.IsKeyColumn,
smap.IsSelectColumn,
smap.PivotScopeID,
scope.PivotScopeValue,
scope.PivotScopeOperator 
FROM RELPivotInfo AS info 
INNER JOIN RELStudyPivotConfig AS smap ON info.PivotID = smap.PivotID 
INNER JOIN RELPivotSourceMap AS map ON map.PivotSource = info.PivotSource 
LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID 
WHERE smap.StudyID = -1 
AND map.PivotSourceType LIKE 'Failure%' 
AND smap.PivotSourceSubType LIKE 'KernelMode'


--GetAllConfiguredFailurePivotsForAVertical
SELECT info.PivotID,
info.PivotSourceColumnName,
info.UIInputDataType,
smap.IsApportionColumn,
smap.IsApportionJoinColumn,
smap.IsKeyColumn,
smap.IsSelectColumn,
smap.PivotScopeID,
scope.PivotScopeValue,
scope.PivotScopeOperator FROM RELPivotInfo AS info 
INNER JOIN RELStudyPivotConfig AS smap 
ON info.PivotID = smap.PivotID INNER JOIN RELPivotSourceMap AS map
 ON map.PivotSource = info.PivotSource LEFT OUTER JOIN RELPivotScope AS scope
 ON smap.PivotScopeID = scope.PivotScopeID 
 WHERE smap.StudyID = 3 AND map.PivotSourceType LIKE 'Failure%' AND smap.PivotSourceSubType LIKE 'UserMode'


-- GetAllDefaultFailurePivotsForAVertical
SELECT info.PivotID,
info.PivotSourceColumnName,
info.UIInputDataType,
smap.IsSelectColumn,
smap.IsKeyColumn,
smap.IsApportionColumn,
smap.IsApportionJoinColumn,
smap.PivotScopeID,
scope.PivotScopeValue,
scope.PivotScopeOperator FROM RELStudyPivotConfigDefault AS smap
 INNER JOIN RELPivotInfo AS info
 ON smap.PivotKey = info.PivotKey INNER JOIN RELPivotSourceMap AS map
 ON info.PivotSource = map.PivotSource LEFT OUTER JOIN RELPivotScope AS scope
 ON smap.PivotScopeID = scope.PivotScopeID 
WHERE smap.PivotSourceSubType LIKE 'KernelMode' AND map.PivotSourceType LIKE 'Failure%'

-- adding key constraints based on discussion with Divyesh (11/22/2021)
select * from RELStudyPivotConfigDefault
select * from RELPivotInfo

-- PivotKey
ALTER TABLE RELStudyPivotConfigDefault
ALTER COLUMN PivotKey NVARCHAR(255) NOT NULL;

ALTER TABLE RELPivotInfo
ALTER COLUMN PivotKey NVARCHAR(255) NOT NULL;

-- PivotSourceSubType
ALTER TABLE RELStudyPivotConfigDefault
ALTER COLUMN PivotSourceSubType NVARCHAR(150) NOT NULL;

-- List all constraints for a specific table
SELECT OBJECT_NAME(OBJECT_ID) AS NameofConstraint,
OBJECT_NAME(parent_object_id) AS TableName,
type_desc AS ConstraintType
FROM sys.objects
WHERE type_desc LIKE '%CONSTRAINT' AND parent_object_id = OBJECT_ID('RELPivotInfo')

-- Modify existing Key Constraints
ALTER TABLE RELStudyPivotConfigDefault
DROP CONSTRAINT PK_PivotKey_PivotSourceSubType

ALTER TABLE RELPivotInfo
DROP CONSTRAINT PK__RELPivot__E1727C5C489B2AA6

ALTER TABLE RELStudyPivotConfigDefault
ADD CONSTRAINT PK_PivotKey_PivotSourceSubType PRIMARY KEY (PivotKey, PivotSourceSubType)

ALTER TABLE RELPivotInfo
ADD CONSTRAINT PK_PivotKey PRIMARY KEY (PivotKey)

-- Add ForiegnKey
ALTER TABLE RELStudyPivotConfigDefault
ADD CONSTRAINT FK_PivotKey
FOREIGN KEY (PivotKey) REFERENCES RELPivotInfo(PivotKey);