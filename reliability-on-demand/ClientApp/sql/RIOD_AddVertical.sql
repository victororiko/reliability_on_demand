/****** Object:  StoredProcedure [dbo].[RIOD_AddVertical]    Script Date: 6/26/2023 12:36:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




ALTER PROCEDURE [dbo].[RIOD_AddVertical]
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
	INSERT INTO RELFailureVertical(VerticalName,FailureEventNameList,FailureEventGroup,PivotSourceSubType,
	IsSubVertical,ParentVerticalName,FailureSourceName,AuxiliaryClause,ImportantProcessClause,Scenario1Clause,HashString,FailureFeederIgnored) 
	VALUES(@VerticalName,@FailureEventNameList,@FailureEventGroup,@PivotSourceSubType,@IsSubVertical,@ParentVerticalName,@FailureSourceName,@AuxiliaryClause,@ImportantProcessClause,@Scenario1Clause,@HashString,@FailureFeederIgnored)

