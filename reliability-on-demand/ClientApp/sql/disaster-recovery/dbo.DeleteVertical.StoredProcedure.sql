/****** Object:  StoredProcedure [dbo].[DeleteVertical]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeleteVertical]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[DeleteVertical] AS' 
END
GO




ALTER PROCEDURE [dbo].[DeleteVertical]
	@VerticalName /*parameter name*/ varchar(96) /*datatype*/
	
-- add more stored procedure parameters here
AS

    -- body of the stored procedure
	DELETE FROM RELFailureVertical WHERE HashString = @VerticalName
GO
