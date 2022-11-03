-- Create a new table called 'RELPivotSourceUsageUnitMap' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.RELPivotSourceUsageUnitMap', 'U') IS NOT NULL
DROP TABLE dbo.RELPivotSourceUsageUnitMap
GO
-- Create the table in the specified schema
CREATE TABLE dbo.RELPivotSourceUsageUnitMap
(
    UsagePivotKey [NVARCHAR](255) NOT NULL PRIMARY KEY, -- primary key column
    PivotSource [VARCHAR](50) NOT NULL
);
GO

-- Add Column StudyType with default = OS
ALTER TABLE dbo.RELPivotSourceUsageUnitMap
ADD StudyType VARCHAR(255) NOT NULL DEFAULT('OS')
GO

EXECUTE GetUsageColumns
GO