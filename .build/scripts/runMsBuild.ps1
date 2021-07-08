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
    [Alias("args", "a")]
    [string] $BuildArguments
)

##
##-------------------------------------------------------------------------------------------------
##

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
## Build the MSBuild command line arguments string.
##

$ProcessArguments = '/nologo'
$ProcessArguments += " ""$ProjectFile"""

if (![String]::IsNullOrEmpty($BuildArguments))
{
    $ProcessArguments += " $BuildArguments"
}

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
