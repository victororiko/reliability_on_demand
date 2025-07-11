/****** Object:  StoredProcedure [dbo].[UpdateMetricConfig]    Script Date: 6/12/2023 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpdateMetricConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[UpdateMetricConfig] AS' 
END
GO
-- Create the stored procedure in the specified schema
ALTER PROCEDURE [dbo].[UpdateMetricConfig]
    @UniqueKey               [UNIQUEIDENTIFIER],
    @MetricName              varchar(255),
    @Vertical                varchar(255),
    @MinUsageInMS            bigint,
    @FailureRateInHour       float,
    @HighUsageMinInMS        bigint,
    @MetricGoal              float,
    @StudyConfigID           bigint,
    @MetricGoalAspirational  float,
    @IsUsage                 bit,
    @PivotKey                nvarchar(255) = null
AS
-- execute update
UPDATE dbo.RELMetricConfig
    SET     -- columns to update
        MetricName = @MetricName,
        Vertical = @Vertical,
        MinUsageInMS = @MinUsageInMS,
        FailureRateInHour = @FailureRateInHour,
        HighUsageMinInMS = @HighUsageMinInMS,
        MetricGoal = @MetricGoal,
        StudyConfigID = @StudyConfigID,
        MetricGoalAspirational = @MetricGoalAspirational,
        IsUsage = @IsUsage,
        PivotKey = @PivotKey
    WHERE UniqueKey = @UniqueKey
GO
