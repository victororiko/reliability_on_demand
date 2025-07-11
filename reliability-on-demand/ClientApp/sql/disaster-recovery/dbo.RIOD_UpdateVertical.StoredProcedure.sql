/****** Object:  StoredProcedure [dbo].[RIOD_UpdateVertical]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_UpdateVertical]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_UpdateVertical] AS' 
END
GO


-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_UpdateVertical]
    @VerticalName /*parameter name*/ varchar(96) /*datatype*/,
    @FailureEventNameList /*parameter name*/ varchar(255) /*datatype*/,
	@FailureEventGroup /*parameter name*/ varchar(255) /*datatype*/,
	@PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/,
	@IsSubVertical /*parameter name*/ bit /*datatype*/,
	@ParentVerticalName /*parameter name*/ varchar(255) /*datatype*/,
	@FailureSourceName /*parameter name*/ varchar(255) /*datatype*/,
	@VerticalFilterExpression /*parameter name*/ varchar(500) /*datatype*/,
	@FailureFeederIgnored /*parameter name*/ bit /*datatype*/,
	@HashString /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    UPDATE RELFailureVertical 
	SET FailureEventNameList = @FailureEventNameList, 
	FailureEventGroup = @FailureEventGroup,
	PivotSourceSubType = @PivotSourceSubType, 
	IsSubVertical = @IsSubVertical,
	ParentVerticalName=@ParentVerticalName, 
	FailureSourceName=@FailureSourceName,
	VerticalFilterExpression = @VerticalFilterExpression,
	VerticalName = @VerticalName,
	FailureFeederIgnored = @FailureFeederIgnored
	WHERE HashString = @HashString
GO
