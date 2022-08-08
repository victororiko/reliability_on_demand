-- Create a new stored procedure called 'PivotConfigExists' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'PivotConfigExists'
)
DROP PROCEDURE dbo.PivotConfigExists
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE dbo.PivotConfigExists
    @StudyConfigID int,
    @PivotKey varchar(255),
    @PivotScopeID int = -1
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELStudyPivotConfig
WHERE PivotKey = @PivotKey
    AND StudyConfigID = @StudyConfigID
    AND PivotScopeID = @PivotScopeID
GO
GO
-- example to execute the stored procedure we just created
EXECUTE dbo.PivotConfigExists 17,'DeviceCensusConsolidated.ss_AADTenantCountryCode',17
GO