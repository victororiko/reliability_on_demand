/****** Object:  StoredProcedure [dbo].[RethrowError]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RethrowError]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RethrowError] AS' 
END
GO
ALTER PROCEDURE [dbo].[RethrowError]
    @ProcedureName SYSNAME ,
    @SendToEventLogFlag BIT = 0
AS 
    SET NOCOUNT ON

    IF ERROR_NUMBER() IS NULL 
        RETURN ;

    DECLARE 
		@ErrorMessage NVARCHAR(4000) ,
        @ErrorNumber INT ,
        @ErrorSeverity INT ,
        @ErrorState INT ,
        @ErrorLine INT ,
        @ErrorProcedure NVARCHAR(200)

    SELECT  @ErrorNumber = ERROR_NUMBER() ,
            @ErrorSeverity = ERROR_SEVERITY() ,
            @ErrorState = ERROR_STATE() ,
            @ErrorLine = ERROR_LINE() ,
            @ErrorProcedure = ISNULL(ERROR_PROCEDURE(), '-')

    IF @ErrorProcedure = N'spRethrowError' 
        BEGIN
            SELECT  @ErrorMessage = ERROR_MESSAGE()
                    + N'  CalledFromProcedure:' + @ProcedureName
        END
    ELSE 
        BEGIN
            SELECT  @ErrorMessage = N'ErrorNumber:'
                    + CAST(@ErrorNumber AS NVARCHAR(10)) + ', '
                    + N'ErrorProcedure:'
                    + CAST(@ErrorProcedure AS NVARCHAR(128)) + ', '
                    + N'ErrorLineNo:' + CAST(@ErrorLine AS NVARCHAR(10))
                    + ', ' + ERROR_MESSAGE()
        END

	-- SQL Azure doesn't support extended procedures (XP_***)
	IF (SELECT SERVERPROPERTY('EDITION')) != N'SQL Azure' AND
       @SendToEventLogFlag = 1 
	BEGIN
        DECLARE @Stmt NVARCHAR(1024) = N'exec master.dbo.xp_logevent ''' + @ErrorNumber + ''', ''' + @ErrorMessage + ', ''ERROR''';
        EXEC sp_executesql @stmt;
    END;

    RAISERROR 
    (
        @ErrorMessage 
        ,@ErrorSeverity 
        ,@ErrorState               
    )
    RETURN @ErrorNumber
GO
