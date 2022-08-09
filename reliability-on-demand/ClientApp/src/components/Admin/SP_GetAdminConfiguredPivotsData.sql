/****** Object:  StoredProcedure [dbo].[GetAdminConfiguredPivotsData]    Script Date: 8/8/2022 9:59:53 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAdminConfiguredPivotsData]
	@source /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	WITH configuredData AS(
    SELECT info.PivotKey,
	info.PivotName,
	info.ADLDataType,
	info.UIInputDataType AS UIDataType,
	config.IsApportionColumn,
	config.IsApportionJoinColumn,
	config.IsKeyColumn,
	config.IsSelectColumn,
	config.AggregateBy,
	config.PivotExpression,
	config.StudyConfigID,
	config.PivotScopeID
	FROM RELStudyPivotConfig AS config INNER JOIN RELPivotInfo AS info
	ON config.PivotKey = info.PivotKey
	WHERE info.PivotSource = @source and config.StudyConfigID = -1)
	SELECT * FROM configuredData FOR JSON AUTO, Include_Null_Values
GO