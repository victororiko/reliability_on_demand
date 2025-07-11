/****** Object:  StoredProcedure [dbo].[RIOD_GetAllSourcesForGivenSourceType]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIOD_GetAllSourcesForGivenSourceType]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIOD_GetAllSourcesForGivenSourceType] AS' 
END
GO

-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[RIOD_GetAllSourcesForGivenSourceType]
-- add more stored procedure parameters here
 @SourceType /*parameter name*/ varchar(50) /*datatype*/ = '' /*default value*/
 AS

 IF @SourceType = 'All'
 BEGIN
-- body of the stored procedure
    SELECT * FROM RELPivotSourceMap
    FOR JSON AUTO, Include_Null_Values
END
ELSE
BEGIN
	SELECT * FROM RELPivotSourceMap
	WHERE PivotSourceType = @SourceType
    FOR JSON AUTO, Include_Null_Values
END
GO
