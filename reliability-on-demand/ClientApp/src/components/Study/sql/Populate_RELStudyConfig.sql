USE ReliabilityReporting

INSERT INTO RELTeamConfig
    ( -- columns to insert data into
    [StudyID],
    [StudyName],
    [LastRefreshDate],
    [CacheFrequency],
    [Expiry],
    [TeamID],
    [ObservationWindowDays]
    )
VALUES
(
    'Seed study 1', --[StudyName]
    '20210218 10:34:09 AM', --[LastRefreshDate]
    '72', --[CacheFrequency]
    '20210518 10:34:09 AM', --[Expiry]
    '1' --[TeamID]
)
GO
