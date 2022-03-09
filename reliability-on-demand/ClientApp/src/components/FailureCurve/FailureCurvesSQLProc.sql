/****** Object:  StoredProcedure [dbo].[GetMaximumStudyPivotConfigCount]    Script Date: 3/2/2022 8:44:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[GetMaximumStudyPivotConfigCount]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyID = @StudyID AND PivotSourceSubType LIKE @PivotSourceSubType

EXEC dbo.GetMaximumStudyPivotConfigCount 
    @StudyID = 1,
    @PivotSourceSubType = ''



SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[GetMaximumPivotScopeCount]
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	SELECT max(PivotScopeID) AS max FROM RELPivotScope

EXEC dbo.GetMaximumPivotScopeCount




CREATE PROCEDURE [dbo].[DeleteStudyIDFromPivotMapping]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELStudyPivotConfig WHERE StudyID = @StudyID AND PivotSourceSubType LIKE @PivotSourceSubType

EXEC dbo.DeleteStudyIDFromPivotMapping
    @StudyID = 1,
    @PivotSourceSubType = ''


CREATE PROCEDURE [dbo].[DeletePivotScopeEnteries]
    @PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/, 
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELPivotScope WHERE PivotScopeID IN (SELECT PivotScopeID FROM RELStudyPivotConfig WHERE StudyID=@StudyID AND PivotSourceSubType=@PivotSourceSubType)

EXEC dbo.DeletePivotScopeEnteries
    @StudyID = 1,
    @PivotSourceSubType = ''


CREATE PROCEDURE [dbo].[DeleteStudyVerticals]
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	DELETE FROM RELFailureVerticalConfig WHERE StudyID = @StudyID

EXEC dbo.DeleteStudyVerticals
    @StudyID = 1



CREATE PROCEDURE [dbo].[AddVerticalsForStudy]
	@Vertical /*parameter name*/ varchar(255) /*datatype*/ = '' /*default value*/,
    @StudyID /*parameter name*/ int /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
	INSERT INTO RELFailureVerticalConfig(StudyID,VerticalName) VALUES(@StudyID,@Vertical)

EXEC dbo.AddVerticalsForStudy
    @StudyID = 1,
	@Vertical=''

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/****** Object:  StoredProcedure [dbo].[GetJSONConfiguredVerticalForAStudy]    Script Date: 3/9/2022 3:25:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetJSONConfiguredVerticalForAStudy]
	@StudyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT f.VerticalName, PivotSourceSubType FROM RELFailureVertical AS f INNER JOIN RELFailureVerticalConfig AS c ON f.VerticalName = c.VerticalName WHERE c.StudyID = @StudyID FOR JSON AUTO, Include_Null_Values
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
/****** Object:  StoredProcedure [dbo].[GetPivots]    Script Date: 3/9/2022 3:26:35 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetPivots]
	@sourcesubtype /*parameter name*/ nvarchar(100) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT PivotID,PivotSourceColumnName,UIInputDataType FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource WHERE info.PivotSourceSubType LIKE @sourcesubtype AND map.PivotSourceType LIKE 'Failure%' FOR JSON AUTO, Include_Null_Values
GO



/****** Object:  StoredProcedure [dbo].[GetAllDefaultFailurePivotsForAVertical]    Script Date: 3/9/2022 3:27:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAllDefaultFailurePivotsForAVertical]
	@sourcesubtype /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT info.PivotID,info.PivotSourceColumnName,info.UIInputDataType,smap.IsSelectColumn,smap.IsKeyColumn,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELStudyPivotConfigDefault AS smap INNER JOIN RELPivotInfo AS info ON smap.PivotKey = info.PivotKey INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.PivotSourceSubType LIKE @sourcesubtype AND map.PivotSourceType LIKE 'Failure%' FOR JSON AUTO, Include_Null_Values
GO


/****** Object:  StoredProcedure [dbo].[GetAllConfiguredFailurePivotsForAVertical]    Script Date: 3/9/2022 3:28:21 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAllConfiguredFailurePivotsForAVertical]
	@sourcesubtype /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@studyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT info.PivotID,info.PivotSourceColumnName,info.UIInputDataType,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.IsKeyColumn,smap.IsSelectColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELPivotInfo AS info INNER JOIN RELStudyPivotConfig AS smap ON info.PivotID = smap.PivotID INNER JOIN RELPivotSourceMap AS map ON map.PivotSource = info.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.StudyID = @studyID AND map.PivotSourceType LIKE 'Failure%' AND smap.PivotSourceSubType LIKE @sourcesubtype FOR JSON AUTO, Include_Null_Values
GO



/****** Object:  StoredProcedure [dbo].[AddFilterPivotToFailureCurve]    Script Date: 3/9/2022 3:28:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[AddFilterPivotToFailureCurve]
	@PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotScopeValue /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/,
	@PivotScopeOperator /*parameter name*/ nvarchar(150) /*datatype*/ = '' /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELPivotScope(PivotScopeID,PivotScopeValue,PivotScopeOperator) VALUES(@PivotScopeID,@PivotScopeValue,@PivotScopeOperator)
GO


/****** Object:  StoredProcedure [dbo].[AddWithoutFilterPivotToFailureCurve]    Script Date: 3/9/2022 3:29:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[AddWithoutFilterPivotToFailureCurve]
	@StudyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@IsSelectPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsKeyPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionJoinPivot /*parameter name*/ bit /*datatype*/ = null  /*default value*/,
	@PivotSourceSubType /*parameter name*/ varchar(150) /*datatype*/ = ''  /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELStudyPivotConfig(StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES(@StudyID,@PivotID,@IsSelectPivot,@IsApportionPivot,@IsKeyPivot,@IsApportionJoinPivot,@PivotSourceSubType)
GO



/****** Object:  StoredProcedure [dbo].[AddFilterPivotsAndValuesToFailureCurve]    Script Date: 3/9/2022 3:31:03 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[AddFilterPivotsAndValuesToFailureCurve]
	@PivotScopeID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@StudyID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@PivotID /*parameter name*/ int /*datatype*/ = -1 /*default value*/,
	@IsSelectPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsKeyPivot /*parameter name*/ bit /*datatype*/ = null /*default value*/,
	@IsApportionJoinPivot /*parameter name*/ bit /*datatype*/ = null  /*default value*/,
	@PivotSourceSubType /*parameter name*/ nvarchar(150) /*datatype*/ = ''  /*default value*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    INSERT INTO RELStudyPivotConfig(PivotScopeID,StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES(@PivotScopeID,@StudyID,@PivotID,@IsSelectPivot,@IsApportionPivot,@IsKeyPivot,@IsApportionJoinPivot,@PivotSourceSubType)
GO

