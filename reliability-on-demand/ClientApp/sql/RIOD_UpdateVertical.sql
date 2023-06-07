

-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[RIOD_UpdateVertical]
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
