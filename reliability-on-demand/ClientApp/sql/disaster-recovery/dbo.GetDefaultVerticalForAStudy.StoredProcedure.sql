/****** Object:  StoredProcedure [dbo].[GetDefaultVerticalForAStudy]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetDefaultVerticalForAStudy]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetDefaultVerticalForAStudy] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetDefaultVerticalForAStudy]
    @StudyConfigID /*parameter name*/ int /*datatype*/ = -1
/*default value*/

-- add more stored procedure parameters here
AS
-- body of the stored procedure
SELECT vert.VerticalName,vert.PivotSourceSubType FROM 
RELStudyTypeDefaultVertical AS dvert
INNER JOIN
RELFailureVertical AS vert
ON dvert.VerticalName = vert.VerticalName
INNER JOIN
RELStudyConfig AS config
ON config.StudyType = dvert.StudyType
WHERE StudyConfigID =  @StudyConfigID
FOR JSON AUTO, Include_Null_Values
GO
