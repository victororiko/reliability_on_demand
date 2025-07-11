/****** Object:  UserDefinedFunction [dbo].[OSVersionToRevisionNumber]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OSVersionToRevisionNumber]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'CREATE FUNCTION [dbo].[OSVersionToRevisionNumber]
(
    -- Pivot parameters
	@OSVersion nvarchar(128)
)
RETURNS nvarchar(128) 
AS
BEGIN
	SET @OSVersion = @OSVersion + ''.''
	SET @OSVersion = SUBSTRING(@OSVersion, CHARINDEX(''.'', @OSVersion)+1, LEN(@OSVersion))
	SET @OSVersion = SUBSTRING(@OSVersion, CHARINDEX(''.'', @OSVersion)+1, LEN(@OSVersion))
	SET @OSVersion = SUBSTRING(@OSVersion, CHARINDEX(''.'', @OSVersion)+1, LEN(@OSVersion))
	RETURN (
		SELECT 
		CASE
			WHEN @OSVersion = '''' THEN @OSVersion
			ELSE CAST( LEFT(@OSVersion, LEN(@OSVersion)-1) AS int)
		END
	);
END;
' 
END
GO
