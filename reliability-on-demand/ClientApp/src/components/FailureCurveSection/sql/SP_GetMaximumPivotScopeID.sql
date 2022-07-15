/****** Object:  StoredProcedure [dbo].[GetTeamConfigs]    Script Date: 7/14/2022 4:03:55 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetMaximumPivotScopeID]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT max(PivotScopeID) AS max FROM RELPivotScope
GO


