/****** Object:  UserDefinedTableType [dbo].[StreamNameTblType]    Script Date: 6/12/2023 2:00:00 PM ******/
IF NOT EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'StreamNameTblType' AND ss.name = N'dbo')
CREATE TYPE [dbo].[StreamNameTblType] AS TABLE(
	[StreamName] [nvarchar](400) NOT NULL
)
GO
