/****** Object:  StoredProcedure [dbo].[GetUsageColumns]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetUsageColumns]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetUsageColumns] AS' 
END
GO
ALTER PROCEDURE [dbo].[GetUsageColumns]
/*default_value_for_param1*/
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM RELPivotSourceUsageUnitMap
FOR JSON AUTO, Include_Null_Values
GO
