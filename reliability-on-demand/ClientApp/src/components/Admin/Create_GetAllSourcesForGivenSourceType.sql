/****** Object:  StoredProcedure [dbo].[GetAllSourcesForGivenSourceType]    Script Date: 8/4/2022 12:12:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[GetAllSourcesForGivenSourceType]
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


