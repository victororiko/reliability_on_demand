/****** Object:  StoredProcedure [dbo].[AddWorkflowExecution]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AddWorkflowExecution]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[AddWorkflowExecution] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[AddWorkflowExecution]
    @ExecutionID /*parameter name*/ UNIQUEIDENTIFIER /*datatype*/,
    @WorkflowName /*parameter name*/ NVARCHAR(255) /*datatype*/,
    @Started /*parameter name*/ NVARCHAR(255) /*datatype*/, 
    @Finished /*parameter name*/ NVARCHAR(255) /*datatype*/,
    @Status /*parameter name*/ NVARCHAR(255) /*datatype*/
-- add more stored procedure parameters here
AS
-- add to XflowMetadata
INSERT INTO [dbo].[XflowMetadata]
    (
        ExecutionID, 
        WorkflowName, 
        Started,
        Finished,
        Status
    )
VALUES
    (
        @ExecutionID,
        @WorkflowName,
        TRY_CAST(@Started as DATETIME),
        TRY_CAST(@Finished as DATETIME),
        CASE 
            WHEN @Status = '0' OR @Status = 0 THEN 'NotStarted'
            WHEN @Status = '1' OR @Status = 1 THEN 'InProgress'
            WHEN @Status = '2' OR @Status = 2 THEN 'Successful'
            WHEN @Status = '4' OR @Status = 4 THEN 'Failed'
            WHEN @Status = '6' OR @Status = 6 THEN 'Canceled'
            ELSE 'Missing status mapping from Xflow'
        END
    )
GO
