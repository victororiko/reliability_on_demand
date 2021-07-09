@ECHO OFF

REM Check to see that the .build Git submodule is populated
IF NOT EXIST "%~dp0.build\scripts\canaveralBuild.ps1" (
    
    ECHO Missing build infrastructure files!  Populating .build submodule...
    
    git submodule init
    git submodule update
    
    ECHO.

    IF NOT EXIST "%~dp0.build\scripts\canaveralBuild.ps1" (

        ECHO ERROR: Failed to populate submodule!

        goto :EOF
    )
) ELSE (

    git status -s .build | find /I "m .build" > nul

    IF NOT ERRORLEVEL 1 (
   
        ECHO Submodule out of date -- updating...
        git submodule update
        ECHO done.
    )
)

ECHO Restoring NuGet packages...
ECHO.

REM This should ensure that Nuget package download is triggered before the test build runs.
REM .build\tools\nuget\nuget.exe restore "%~dp0TEAM_NAME\Project\Project.sln" -ConfigFile "%~dp0nuget.config"

ECHO.

SET targetProjectFile=%~1

REM If you wish to build dirs.proj, no parameter is required.
REM If you wish to build a specific project, pass in that project file as the first parameter (e.g. testBuild.cmd .\Workflows\MyFeature\Deploy.xflowproj)

IF /I "%targetProjectFile%" == "" (
    powershell -File "%~dp0.build\scripts\canaveralBuild.ps1" "%~dp0dirs.proj" -Targets "Build,Deploy" -RootDirectory %~dp0 -DefaultProperties "FakeDeployment=true"
) ELSE (
    IF /I "%~2" == "-deploy" (
        REM See if the target project file path end with "dirs.proj"
        IF /I "%targetProjectFile:~-9%" == "dirs.proj" (
            ECHO ERROR: Deploying dirs.proj files is not supported
        ) ELSE (
            powershell -File "%~dp0.build\scripts\canaveralBuild.ps1" "%targetProjectFile%" -Targets "Build,Deploy" -RootDirectory %~dp0 -DefaultProperties "FakeDeployment=false"
        )
    ) ELSE (
        powershell -File "%~dp0.build\scripts\canaveralBuild.ps1" "%targetProjectFile%" -Targets "Build,Deploy" -RootDirectory %~dp0 -DefaultProperties "FakeDeployment=true"    
    )

)