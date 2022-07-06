-------Modifications-------
-- take a backup of current table renamed LEGACY
select * into RELStudyPivotConfig_LEGACY
from RELStudyPivotConfig
go
select * into RELStudyPivotConfigDefault_LEGACY
from RELStudyPivotConfigDefault
go
select * into RELPivotScope_LEGACY
from RELPivotScope
GO