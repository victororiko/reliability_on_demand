##-------------------------------------------------------------------------------------------------
##
## Copyright (c) Microsoft Corporation.  All rights reserved.
##
##-------------------------------------------------------------------------------------------------

[CmdletBinding()]
Param
(
    [Parameter(Mandatory = $True, Position = 0)]
    [string] $ProjectFile,

    [Parameter(Mandatory = $False)]
    [Alias("properties", "p")]
    [string] $BuildProperties,

    [Parameter(Mandatory = $False)]
    [Alias("targets", "t")]
    [string] $BuildTargets = 'Build',

    [Parameter(Mandatory = $False)]
    [Alias("defaultProperties", "dp")]
    [string] $DefaultBuildProperties,

    [Parameter(Mandatory = $False)]
    [Alias("package", "pn")]
    [string] $PackageName = 'Canaveral',

    [Parameter(Mandatory = $True)]
    [Alias("root")]
    [string] $RootDirectory,

    [Parameter(Mandatory = $False)]
    [Alias("toolsDir")]
    [string] $ToolsDirectory,

    [Switch]
    [bool] $SkipInstall,

    [Switch]
    [bool] $Prerelease
)

##
##-------------------------------------------------------------------------------------------------
##

##
## Trim the trailing slash on the root directory.
##

$RootDirectory = $RootDirectory.Trim('\')

$quality = if ($Prerelease) { 'Prerelease' } else { 'Release' }

$targetDirectory = "$RootDirectory\packages"
$canaveralToolsDirectory = ''

if ($SkipInstall -eq $False)
{
    ##
    ## Install the latest Canaveral version.
    ##

    & "$PSScriptRoot\InstallCanaveral.ps1" $targetDirectory -PackageName $PackageName -Quality $quality

    if ($LASTEXITCODE -ne 0)
    {
        Write-Host -ForegroundColor Red 'Canaveral install failed - aborting build'
        Exit 1
    }

    $canaveralToolsDirectory = $env:CanaveralToolsDirectory
}
elseif ($ToolsDirectory -ne '')
{
    ##
    ## If the tools directory was passed in, just set up the variables.
    ##

    $env:CanaveralToolsDirectory = $ToolsDirectory
    $canaveralToolsDirectory = $ToolsDirectory
}
else
{
    ##
    ## Make sure we have an existing version installed and set the environment variable.
    ##

    $packageName = $PackageName
    $packageDirectories = Get-ChildItem -Path $targetDirectory -Directory
    $latestVersion = New-Object System.Version -ArgumentList 0, 0, 0, 0
    $canaveralDirectory

    foreach ($packageDirectory in $packageDirectories)
    {
        if ($packageDirectory.Name.StartsWith("$packageName"))
        {
            $versionString = $packageDirectory.Name.Substring("$packageName.".Length)

            $packageVersion = New-Object System.Version

            if ([Version]::TryParse($versionString, [ref] $packageVersion))
            {
                if ($packageVersion -gt $latestVersion)
                {
                    $canaveralToolsDirectory = $packageDirectory.FullName
                    $latestVersion = $packageVersion
                }
            }
        }
    }

    if ($canaveralToolsDirectory -eq '')
    {
        Write-Host -ForegroundColor Red "ERROR: Canaveral tools not installed - re-run without the SkipInstall switch"
        Exit 1
    }
}

##
## Locate MSBuild.exe.  We will prefer the VS2017 version if it is available; otherwise, we
## will fall back to the built-in version.
##

$MSBuildFileName = ''
$MSBuildDirectory = ''

##
## First, we will try to locate the vswhere.exe tool that comes with VS 2017 (or later).  If we
## don't find it, the user doesn't have VS 2017 (or later).
##

Write-Host (New-Object System.String ('=', $Host.UI.RawUI.BufferSize.Width)) -ForegroundColor DarkCyan

$VSWherePath = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

if (Test-Path -Path "$VSWherePath")
{
    $LatestVSInstallationPath = & "$VSWherePath" -latest -products * -requires Microsoft.Component.MSBuild -property installationPath

    if ($LatestVSInstallationPath)
    {
        $LatestVSInstallationVersion = & "$VSWherePath" -latest -products * -requires Microsoft.Component.MSBuild -property installationVersion
        $LatestVSDisplayName = & "$VSWherePath" -latest -products * -requires Microsoft.Component.MSBuild -property displayName

        ##
        ## Probe for MSBuild.exe under the installation directory.  We know it will be at
        ## $LatestVSInstallationPath\MSBuild\XXX\Bin\MSBuild.exe but the value of XXX depends
        ## on the installed version of Visual Studio.
        ##

        $MSBuildDirectory = Join-Path $LatestVSInstallationPath "MSBuild"
        $MSBuildSubdirectories = Get-ChildItem -Path $MSBuildDirectory -Directory

        foreach ($MSBuildSubdirectory in $MSBuildSubdirectories)
        {
            $MSBuildPath = Join-Path $MSBuildSubdirectory.FullName "Bin\MSBuild.exe"

            if (Test-Path $MSBuildPath)
            {
                $MSBuildFileName = $MSBuildPath
                Write-Host "Using MSBuild from $LatestVSDisplayName (version $LatestVSInstallationVersion)"
                break
            }
        }
    }
}

if ([String]::IsNullOrEmpty($MSBuildFileName))
{
    $MSBuildFileName = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe"
    $MSBuildDirectory = "$env:ProgramFiles(x86)\MSBuild"
    Write-Host 'Using system version of MSBuild'
}

$CanaveralBuildTasksPath = Join-Path $canaveralToolsDirectory "CanaveralBuildTasks.dll"

Write-Host """$MSBuildFileName"" " -ForegroundColor DarkYellow -NoNewLine

if (!(Test-Path -Path $MSBuildFileName))
{
   throw New-Object -TypeName System.IO.FileNotFoundException -ArgumentList "The detected version of MSBuild ($MSBuildFileName) does not exist"
}

##
## Make sure the project file exists.
##

if (!(Test-Path -Path $ProjectFile))
{
   throw New-Object -TypeName System.IO.FileNotFoundException -ArgumentList "The specified project file ($ProjectFile) does not exist"
}

##
## Try to get the repo name.
##

$GitRepositoryName = ''

try
{
    $GitRemoteOriginUrl = & 'git.exe' config --get remote.origin.url
    $GitRemoteOriginUrl = $GitRemoteOriginUrl.TrimEnd('/')

    $GitRepositoryName = $GitRemoteOriginUrl.Substring($GitRemoteOriginUrl.LastIndexOf('/') + 1)
}
catch
{
}

##
## Build the MSBuild command line arguments string.
##

$ProcessArguments = '/nologo'

$ProcessArguments += " /t:$BuildTargets"

if (Test-Path -Path $CanaveralBuildTasksPath)
{
    ##
    ## If the installed version of Canaveral supports it, enable the summary logger.
    ##

    $AssemblyFileVersion = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($CanaveralBuildTasksPath);
    $CurrentVersion = New-Object System.Version -ArgumentList $AssemblyFileVersion.FileVersion;
    $MinimumLoggerVersion = New-Object System.Version -ArgumentList '3.1.0.6'

    if ($CurrentVersion -ge $MinimumLoggerVersion)
    {
        $ProcessArguments += " /logger:CanaveralSummaryLogger,""$CanaveralBuildTasksPath"""
    }
}

$ProcessArguments += " /p:RootDirectory=""$RootDirectory"""
$ProcessArguments += " /p:CanaveralToolsDirectory=""$canaveralToolsDirectory"""

if (![String]::IsNullOrEmpty($DefaultBuildProperties))
{
    $ProcessArguments += " /p:$DefaultBuildProperties"
}

if (![String]::IsNullOrEmpty($BuildProperties))
{
    $ProcessArguments += " /p:$BuildProperties"
}

if (![String]::IsNullOrEmpty($GitRepositoryName))
{
    $ProcessArguments += " /p:WorkflowRepositoryTag=$GitRepositoryName"
}

$ProcessArguments += " ""$ProjectFile"""

Write-Host "$ProcessArguments" -ForegroundColor DarkGray

Write-Host (New-Object System.String ('=', $Host.UI.RawUI.BufferSize.Width)) -ForegroundColor DarkCyan
Write-Host

##
## Run MSBuild and wait for it to complete.
##

$ps = New-Object System.Diagnostics.Process

$ps.StartInfo.Filename = $MSBuildFileName
$ps.StartInfo.Arguments = $ProcessArguments
$ps.StartInfo.UseShellExecute = $false

$ps.Start() | Out-Null

$ps.WaitForExit()

exit $ps.ExitCode
