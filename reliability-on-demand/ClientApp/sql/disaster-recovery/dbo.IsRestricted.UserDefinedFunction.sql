/****** Object:  UserDefinedFunction [dbo].[IsRestricted]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[IsRestricted]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'Create FUNCTION [dbo].[IsRestricted] 
(
    @Data xml
)
RETURNS nvarchar(50)
WITH SCHEMABINDING
AS
BEGIN
    return @Data.value(''(/Fields/Field[@name="RestrictedStudy"]/text())[1]'',''nvarchar(max)'') 
END' 
END
GO
