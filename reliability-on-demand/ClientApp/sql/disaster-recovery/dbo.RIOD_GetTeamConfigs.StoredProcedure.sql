/****** Object:  StoredProcedure [dbo].[RIOD_GetTeamConfigs]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetTeamConfigs]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetTeamConfigs] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetTeamConfigs]
-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT *
FROM dbo.RELTeamConfig 
-- WHERE TeamID > -1 
FOR JSON AUTO, Include_Null_Values
GO
