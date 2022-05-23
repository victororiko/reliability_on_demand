USE ReliabilityReporting

INSERT INTO RELTeamConfig
    ( -- columns to insert data into
    OwnerContact,OwnerTeamFriendlyName,OwnerTriageAlias,ComputeResourceLocation,HashString
    )
VALUES
    ( -- first row: values for the columns in the list above
        'OSGRELDEV', 'CLIENT FUN Team', 'OSGRELDEV', 'https://cosmos15.osdinfra.net/cosmos/asimov.partner.osg', 'CLIENT FUN Team'
),
    ( -- second row: values for the columns in the list above
        'xboxtriage', 'XBOX TEAM'            , 'xboxtriagedev'   , 'https://cosmos11.osdinfra.net/cosmos/asimov.partner.osg', 'XBOX TEAM'
),
    -- add more rows here
    ( -- second row: values for the columns in the list above
        'osgfun'    , 'WDG FUN Team'         , 'osgfun'          , 'https://cosmos15.osdinfra.net/cosmos/asimov.partner.osg', 'WDG FUN Team'

)
GO
