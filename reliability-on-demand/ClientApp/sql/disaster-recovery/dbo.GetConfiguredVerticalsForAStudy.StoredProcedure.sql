/****** Object:  StoredProcedure [dbo].[GetConfiguredVerticalsForAStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetConfiguredVerticalsForAStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetConfiguredVerticalsForAStudy] AS' 
END
GO



-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetConfiguredVerticalsForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT STRING_AGG(VerticalName,';') AS Vertical
FROM RELFailureVerticalConfig 
GROUP BY  StudyConfigID
HAVING StudyConfigID = @StudyConfigID;
GO
