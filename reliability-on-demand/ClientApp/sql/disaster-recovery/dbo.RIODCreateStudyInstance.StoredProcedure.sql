/****** Object:  StoredProcedure [dbo].[RIODCreateStudyInstance]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RIODCreateStudyInstance]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[RIODCreateStudyInstance] AS' 
END
GO

ALTER PROCEDURE [dbo].[RIODCreateStudyInstance]
(
	@StudyInstID uniqueidentifier,
    @StudyID uniqueidentifier,
	@TotalUsedMachines float = NULL,
	@TotalUsageHours float = NULL,
	@TotalMachineCount float = NULL,
	@Vertical nvarchar(128),
	@StartTime datetime,
	@EndTime datetime
)
AS
BEGIN
	INSERT INTO dbo.RELStudyInstance
	VALUES (
		@StudyInstID,
		@StudyID,
		@TotalMachineCount,
		@TotalUsedMachines,
		@TotalUsageHours,
		@Vertical,
		@StartTime,
		@EndTime
	)
END
GO
