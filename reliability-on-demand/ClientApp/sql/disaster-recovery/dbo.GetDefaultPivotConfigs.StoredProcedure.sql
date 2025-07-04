/****** Object:  StoredProcedure [dbo].[GetDefaultPivotConfigs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetDefaultPivotConfigs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetDefaultPivotConfigs] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetDefaultPivotConfigs]
    @PivotSource /*parameter name*/ varchar(255) /*datatype_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
select
    [RELStudyPivotConfigDefault].*,
    [RELPivotInfo].PivotName,
    [RELPivotInfo].PivotSource,
    [RELPivotInfo].PivotKey
from [RELStudyPivotConfigDefault]
    inner join [RELPivotInfo]
    on [RELStudyPivotConfigDefault].PivotKey = [RELPivotInfo].PivotKey
where [RELStudyPivotConfigDefault].PivotKey LIKE CONCAT(@PivotSource,'%')
FOR JSON AUTO, Include_Null_Values
GO
