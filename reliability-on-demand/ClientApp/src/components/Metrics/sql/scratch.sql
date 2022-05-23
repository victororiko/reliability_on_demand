select *
into RELTeamConfig_Clone
from RELTeamConfig
go


select *
from RELTeamConfig_Clone
GO

-- Add a new column 'HashString' to table 'RELTeamConfig_Clone' in schema 'dbo'
ALTER TABLE dbo.RELTeamConfig_Clone
    ADD HashString /*new_column_name*/ varchar(max) /*new_column_datatype*/ NULL /*new_column_nullability*/
GO

-- Update rows in table 'RELTeamConfig_Clone'
UPDATE RELTeamConfig_Clone
SET
    HashString = OwnerTeamFriendlyName
    -- add more columns and values here
GO

-- Add a new column 'HashStringId' to table 'RELTeamConfig_Clone' in schema 'dbo'
ALTER TABLE dbo.RELTeamConfig_Clone
    ADD HashStringId /*new_column_name*/ UNIQUEIDENTIFIER /*new_column_datatype*/ NULL /*new_column_nullability*/
GO

-- Update rows in table 'RELTeamConfig_Clone'
UPDATE RELTeamConfig_Clone
SET
    HashStringId = CONVERT(UNIQUEIDENTIFIER, HASHBYTES('MD5', HashString))
    -- add more columns and values here
GO

-- example on how to use HashStringId
-- select * from RELTeamConfig_Clone 
-- where HashStringId like 'f8b916b7-18df-61ed-ea59-9e05e786d224'

-- With Divyesh
select *
from [dbo].[RELTeamConfig] -- teamName
go
select *
from [dbo].[RELStudyConfig] -- team.hashString()_studyName
go
select *
from [dbo].[RELFailureVerticalConfig] -- study.hashString()_vertical 
go
select *
from [dbo].[RelMetricConfiguration] -- failureVerticalConfig.hashString()_metricName
go

--- notes
-- make sure studyid is related as a ForiegnKey and have cascade delete





