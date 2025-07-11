/****** Object:  UserDefinedFunction [dbo].[GetPivotName]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetPivotName]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'CREATE FUNCTION [dbo].[GetPivotName](@PivotKey VARCHAR(255))
RETURNS VARCHAR(255)
AS
-- Returns the stock level for the product.
BEGIN
    DECLARE @ret VARCHAR(255);
    SELECT @ret = value 
    FROM STRING_SPLIT(@PivotKey,''_'',1)
    WHERE ordinal = 2;
    RETURN @ret;
END;' 
END
GO
