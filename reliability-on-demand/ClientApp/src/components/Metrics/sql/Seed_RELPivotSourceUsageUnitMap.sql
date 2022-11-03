-- seed from existing RELPivotInfo
-- NOTE: run this file only after creating table RELPivotSourceUsageUnitMap 
insert into RELPivotSourceUsageUnitMap 
select 
    PivotKey,
    PivotSource
 from RELPivotInfo
where PivotKey like '%Usage%' and PivotSourceColumnName like '%ms'
go

-- test
select * from RELPivotSourceUsageUnitMap
go