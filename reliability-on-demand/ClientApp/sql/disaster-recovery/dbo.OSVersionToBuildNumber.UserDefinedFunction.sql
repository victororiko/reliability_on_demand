/****** Object:  UserDefinedFunction [dbo].[OSVersionToBuildNumber]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OSVersionToBuildNumber]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'-- =============================================
-- Author:      Ivan Chuprinov
-- Create Date: 08/27/2020
-- Description: Returns Build Number given the OSVersion
-- =============================================
CREATE FUNCTION [dbo].[OSVersionToBuildNumber]
(
    -- Pivot parameters
	@OSVersion nvarchar(128)
)
RETURNS int 
AS
BEGIN
	SET @OSVersion = @OSVersion + ''.''
	SET @OSVersion = SUBSTRING(@OSVersion, CHARINDEX(''.'', @OSVersion)+1, LEN(@OSVersion))
	SET @OSVersion = SUBSTRING(@OSVersion, CHARINDEX(''.'', @OSVersion)+1, LEN(@OSVersion))
	RETURN(CAST(SUBSTRING(@OSVersion, 0, CHARINDEX(''.'', @OSVersion)) AS int))
END;' 
END
GO
