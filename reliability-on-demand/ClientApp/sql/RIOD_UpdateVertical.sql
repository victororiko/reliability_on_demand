/****** Object:  StoredProcedure [dbo].[RIOD_UpdateVertical]    Script Date: 6/26/2023 12:41:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	@AuxiliaryClause /*parameter name*/ varchar(128) /*datatype*/,
	@ImportantProcessClause /*parameter name*/ varchar(600) /*datatype*/,
	@Scenario1Clause /*parameter name*/ varchar(600) /*datatype*/,
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
	AuxiliaryClause = @AuxiliaryClause,
	ImportantProcessClause = @ImportantProcessClause,
	Scenario1Clause = @Scenario1Clause,
	VerticalName = @VerticalName,
	FailureFeederIgnored = @FailureFeederIgnored
	WHERE HashString = @HashString
