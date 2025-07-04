/****** Object:  StoredProcedure [dbo].[GetPivotConfigs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetPivotConfigs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetPivotConfigs] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetPivotConfigs]
    @PivotSource /*parameter name*/ varchar(255) /*datatype_for_param1*/,
    @StudyID int
-- add more stored procedure parameters here
AS
-- body of the stored procedure
select 
[dbo].[RELStudyPivotConfig].*
from [dbo].[RELStudyPivotConfig]
inner join [dbo].[RELPivotInfo]
on [dbo].[RELStudyPivotConfig].PivotID = [dbo].[RELPivotInfo].PivotID
where PivotSource = @PivotSource and StudyID = @StudyID
FOR JSON AUTO, Include_Null_Values
GO
