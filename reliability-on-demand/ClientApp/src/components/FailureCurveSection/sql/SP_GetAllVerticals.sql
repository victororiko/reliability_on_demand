/****** Object:  StoredProcedure [dbo].[GetMaximumPivotScopeID]    Script Date: 7/14/2022 10:15:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetAllVerticals]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT VerticalName,PivotSourceSubType FROM [dbo].[RELFailureVertical] FOR JSON AUTO, Include_Null_Values
GO


