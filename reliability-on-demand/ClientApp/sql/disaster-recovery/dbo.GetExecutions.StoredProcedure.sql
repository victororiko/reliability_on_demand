/****** Object:  StoredProcedure [dbo].[GetExecutions]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetExecutions]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[GetExecutions] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[GetExecutions]
    @Started /*parameter name*/ DATETIME /*datatype*/ = '7/29/2021' /*default value*/,
	@Finished/*parameter name*/ DATETIME /*datatype*/ = '08/06/2021' /*default value*/ 
	
-- add more stored procedure parameters here
AS
    -- body of the stored procedure
    SELECT * FROM dbo.XflowMetadata
	WHERE Started > @Started AND Finished < @Finished

GO
