



CREATE PROCEDURE [dbo].[RIOD_AddVertical]
	@VerticalName /*parameter name*/ varchar(96) /*datatype*/,
    @FailureEventNameList /*parameter name*/ varchar(255) /*datatype*/,
	@FailureEventGroup /*parameter name*/ varchar(255) /*datatype*/,
	@PivotSourceSubType /*parameter name*/ varchar(255) /*datatype*/,
	@IsSubVertical /*parameter name*/ bit /*datatype*/,
	@ParentVerticalName /*parameter name*/ varchar(255) /*datatype*/,
	@FailureSourceName /*parameter name*/ varchar(255) /*datatype*/,
	@VerticalFilterExpression /*parameter name*/ varchar(255) /*datatype*/,
	@FailureFeederIgnored /*parameter name*/ bit /*datatype*/,
	@HashString /*parameter name*/ varchar(255) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	INSERT INTO RELFailureVertical(VerticalName,FailureEventNameList,FailureEventGroup,PivotSourceSubType,
	IsSubVertical,ParentVerticalName,FailureSourceName,VerticalFilterExpression,HashString,FailureFeederIgnored) 
	VALUES(@VerticalName,@FailureEventNameList,@FailureEventGroup,@PivotSourceSubType,@IsSubVertical,@ParentVerticalName,@FailureSourceName,@VerticalFilterExpression,@HashString,@FailureFeederIgnored)

