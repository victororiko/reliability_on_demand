/****** Object:  StoredProcedure [dbo].[SaveVertical]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SaveVertical]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[SaveVertical] AS' 
END
GO




ALTER PROCEDURE [dbo].[SaveVertical]
	@VerticalName /*parameter name*/ varchar(96) /*datatype*/,
    @FailureEventNameList /*parameter name*/ varchar(255) /*datatype*/,
	@FailureEventGroup /*parameter name*/ varchar(255) /*datatype*/,
	@PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/,
	@IsSubVertical /*parameter name*/ bit /*datatype*/,
	@ParentVerticalName /*parameter name*/ varchar(255) /*datatype*/,
	@FailureSourceName /*parameter name*/ varchar(255) /*datatype*/,
	@VerticalFilterExpression /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	INSERT INTO RELFailureVertical(VerticalName,FailureEventNameList,FailureEventGroup,PivotSourceSubType,
	IsSubVertical,ParentVerticalName,FailureSourceName,VerticalFilterExpression) 
	VALUES(@VerticalName,@FailureEventNameList,@FailureEventGroup,@PivotSourceSubType,@IsSubVertical,@ParentVerticalName,@FailureSourceName,@VerticalFilterExpression)

GO
