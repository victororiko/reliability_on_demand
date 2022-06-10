select * from [dbo].[RELPivotSourceMap]
where PivotSourceType = 'PopulationSourceType'


select * from [dbo].[RELPivotInfo] -- to get pivot info
where PivotSource = 'DeviceCensusConsolidated.ss'

EXECUTE GetPopulationPivots 'DeviceCensusConsolidated.ss'

select * from RELStudyPivotConfigDefault


select * from [dbo].[RELStudyPivotConfig]

select * from [dbo].[RELStudyPivotConfig]
where PivotID = 149

insert into RELStudyPivotConfig
(StudyID, PivotID, AggregateBy,PivotSourceSubType)
VALUES
(1,149,1,'AllMode')

select * from [dbo].[RELPivotScope] -- filter expression

-- example of pivot scope
--     OSBranch in ('rs_prerelease', 'ni_moment') 
-- AND OSBuild > 25000 and OSBuild < 26000 -- scope id = 7

-- AND OSBuild > 26000 and OSBuild < 27000 -- scope id = 8



