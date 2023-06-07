

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_GetMaximumPivotScopeID]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT max(PivotScopeID) AS max FROM RELPivotScope
