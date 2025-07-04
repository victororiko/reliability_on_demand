/****** Object:  StoredProcedure [dbo].[RIODGetFieldValues]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODGetFieldValues]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODGetFieldValues] AS' 
END
GO
ALTER PROCEDURE [dbo].[RIODGetFieldValues]
(
    -- Add the parameters for the stored procedure here
    @FieldName nvarchar(128) = NULL
)
AS
BEGIN
    SELECT *
	FROM dbo.view_RELField_Value
	WHERE 
		 @FieldName IS NULL OR FieldName = @FieldName
	ORDER BY FieldName, FieldValue
END
GO
