##-------------------------------------------------------------------------------------------------
##
## Copyright (c) Microsoft Corporation.  All rights reserved.
##
##-------------------------------------------------------------------------------------------------

using namespace System.Collections.Generic
using namespace System.IO

[CmdletBinding()]
Param
(
    [Parameter(Mandatory = $true, Position = 0)]
    [string] $FileNameFilter,

    [Parameter(Mandatory = $false)]
    [Alias("dest", "d")]
    [string] $DestinationDirectory = $env:BUILD_ARTIFACTSTAGINGDIRECTORY,

    [Parameter(Mandatory = $False)]
    [Alias("root")]
    [string] $RootDirectory = $env:BUILD_SOURCESDIRECTORY,

    [Parameter(Mandatory = $False)]
    [Alias("id")]
    [string] $BuildId = $env:BUILD_BUILDID,

    [Parameter(Mandatory = $False)]
    [Alias("head")]
    [string] $CurrentCommitHash = $env:BUILD_SOURCEVERSION,

    [Parameter(Mandatory = $False)]
    [Alias("project", "p")]
    [string] $ProjectName = 'OSGData',

    [Parameter(Mandatory = $False)]
    [Alias("t")]
    [string] $Token,

    [Switch]
    [Alias("all")]
    [bool] $IncludeAllFiles = $False
)

##
##-------------------------------------------------------------------------------------------------
##

$exitCode = 0

##
## Ensure we have a valid destination directory, creating it if needed.
##

if ([String]::IsNullOrEmpty($DestinationDirectory))
{
    Write-Host -ForegroundColor Red "##vso[task.logissue type=error;sourcepath=$($fileInfo.FullName);linenumber=0;columnnumber=0;] No destination directory specified"
    Exit 1
}

if (-not (Test-Path -LiteralPath $DestinationDirectory -Type Container))
{
    New-Item -Type Directory -Path $DestinationDirectory | Out-Null
}

if ($IncludeAllFiles)
{
    Write-Host "Staging all $FileNameFilter files to $DestinationDirectory..."
}
else
{
    Write-Host "Staging modified $FileNameFilter files to $DestinationDirectory..."
}

Write-Host ''

##
## If we're not staging all matching files, try to get the list of modified files.
##

$filesToStage = New-Object List[string]

if ($IncludeAllFiles)
{
    ##
    ## Stage all matching files.
    ##

    $allFiles = Get-ChildItem -Recurse $FileNameFilter

    Write-Host "  Found $($allFiles.Count) matching file(s)"

    foreach ($file in $allFiles)
    {
        $filesToStage.Add($file.FullName)
    }
}
else
{
    ##
    ## Get the list of modified files from Git.
    ##

    $tempFilePath = [Path]::Combine([Path]::GetTempPath(), [Path]::GetRandomFileName())

    & "$PSScriptRoot\getModifiedFiles.ps1" -buildId $BuildId -outputFilePath "$tempFilePath" -fileNameFilter $FileNameFilter -projectName $ProjectName -currentCommitHash $CurrentCommitHash -rootDirectory $RootDirectory -token $Token
    
    $lines = [File]::ReadAllLines($tempFilePath)
    
    foreach ($line in $lines)
    {
        $trimmedLine = $line.Trim()
        
        if (-not ([String]::IsNullOrEmpty($trimmedLine)))
        {
            $filesToStage.Add($trimmedLine)
        }
    }
    
    Remove-Item $tempFilePath
}

##
## If we have files to stage, copy them to the destination directory.
##

if ($filesToStage.Count -gt 0)
{
    Write-Host 'Staging files...'
    Write-Host ''

    foreach ($fileToStage in $filesToStage)
    {
        Write-Host "  Copying $fileToStage to $DestinationDirectory..."

        $destinationFileName = [Path]::GetFileName($fileToStage)
        $destinationFilePath = [Path]::Combine($DestinationDirectory, $destinationFileName)
        
        if (Test-Path -Path $destinationFilePath)
        {
            Write-Host -ForegroundColor Red "##vso[task.logissue type=error;sourcepath=$fileToStage;linenumber=0;columnnumber=0;] Duplicate file name detected ($destinationFileName)"

            $exitCode = 1
        }
        else
        {
            Copy -Path $fileToStage -Destination $DestinationDirectory
            Write-Host "  Complete."
        }
    }

    Write-Host ''
}

if ($exitCode -eq 0)
{
    Write-Host "Staging complete."
}
else
{
    Write-Host "Staging failed!"
}

