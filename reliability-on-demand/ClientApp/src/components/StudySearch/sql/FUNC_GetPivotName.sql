IF OBJECT_ID (N'dbo.GetPivotName', N'FN') IS NOT NULL
    DROP FUNCTION GetPivotName;
GO
CREATE FUNCTION dbo.GetPivotName(@PivotKey VARCHAR(255))
RETURNS VARCHAR(255)
AS
-- Returns the stock level for the product.
BEGIN
    DECLARE @ret VARCHAR(255);
    SELECT @ret = value 
    FROM STRING_SPLIT(@PivotKey,'_',1)
    WHERE ordinal = 2;
    RETURN @ret;
END;