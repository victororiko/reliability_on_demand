/****** Object:  StoredProcedure [dbo].[GetMetricConfigs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetMetricConfigs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetMetricConfigs] AS' 
END
GO

ALTER PROCEDURE [dbo].[GetMetricConfigs]
    @StudyConfigID /*parameter name*/ int/*datatype_for_param1*/= -1
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RELMetricConfig
WHERE StudyConfigID = @StudyConfigID
FOR JSON AUTO, Include_Null_Values
GO
