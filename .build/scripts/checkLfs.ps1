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
    [Parameter(Mandatory = $false, Position = 0)]
    [string] $RootDirectory = $env:BUILD_SOURCESDIRECTORY,

    [Switch]
    [Alias("ado")]
    [bool] $UseAdoLogging = $False
)

##
##-------------------------------------------------------------------------------------------------
##

[List[string]] $LfsPointerFilePaths = New-Object List[string]
[List[string]] $LfsMatchingFilePaths = New-Object List[string]
[List[string]] $LfsFilePatterns = New-Object List[string]

##
##-------------------------------------------------------------------------------------------------
##

$errorCount = 0

##
## Use the current directory if no root directory was specified.
##

if ($RootDirectory -eq '')
{
    $RootDirectory = [Directory]::GetCurrentDirectory()
}

$RootDirectory = [Path]::GetFullPath($RootDirectory)

Write-Host "Checking LFS files in $RootDirectory..."
Write-Host ''

##
## Get the list of file patterns LFS *should be* tracking.
##

$lfsTrackOutput = & git lfs track --no-excluded

foreach ($line in $lfsTrackOutput)
{
    ##
    ## The output lines here look like:
    ##
    ##     *.pbix [lockable] (.gitattributes)
    ##
    ## There is an initial header line in the output that we need to skip.
    ##

    if ($line.StartsWith('Listing tracked patterns') -eq $False)
    {
        $fields = $line.Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
        $LfsFilePatterns.Add($fields[0])
    }
}

if ($LfsFilePatterns.Count -eq 0)
{
    Write-Host "  LFS is not tracking any file patterns"
}
else
{
    Write-Host "  LFS tracked patterns: $LfsFilePatterns"
    Write-Host ''

    ##
    ## Get the list of files in the repository that match the LFS file patterns.
    ##

    foreach ($filePattern in $LfsFilePatterns)
    {
        $matchingFiles = Get-ChildItem -Path "$RootDirectory" -Filter "$filePattern" -Recurse

        foreach ($matchingFile in $matchingFiles)
        {
            $LfsMatchingFilePaths.Add($matchingFile.FullName)
        }
    }

    Write-Host "  Found $($LfsMatchingFilePaths.Count) file(s) matching tracked patterns"

    ##
    ## Get the list of files LFS *is* tracking.
    ##

    $lfsFilesOutput = & git lfs ls-files

    foreach ($line in $lfsFilesOutput)
    {
        ##
        ## The output lines here look like:
        ##
        ## d7abedec55 * WDUX/Pen/Pen_OKR_Funnel.pbix
        ##

        $fields = $line.Split(' ', 3)
        $LfsPointerFilePaths.Add([Path]::Combine($RootDirectory, $fields[2].Replace('/', '\')))
    }

    Write-Host "  Found $($LfsPointerFilePaths.Count) file(s) tracked by LFS"

    ##
    ## Now, compare the list of files LFS *should be* tracking with the list of files it *is*
    ## tracking to look for files that should be pointers.
    ##

    foreach($matchingFilePath in $LfsMatchingFilePaths)
    {
        $foundMatch = $False

        foreach ($pointerFilePath in $LfsPointerFilePaths)
        {
            if ($pointerFilePath -eq $matchingFilePath)
            {
                $foundMatch = $True
                continue
            }
        }

        if ($foundMatch -eq $False)
        {
            if ($errorCount -eq 0)
            {
                Write-Host ''
            }

            if ($UseAdoLogging)
            {
                Write-Host -ForegroundColor Red "##vso[task.logissue type=error;sourcepath=$matchingFilePath;linenumber=0;columnnumber=0;] Found binary file that should have been a pointer"
            }
            else
            {
                Write-Host -ForegroundColor Red "  ERROR: Found binary file that should have been a pointer ($matchingFilePath)"        
            }

            $errorCount++
        }
    }
}

Write-Host ''

if ($errorCount -gt 1)
{
    Write-Host "Complete with $errorCount errors."
}
elseif ($errorCount -gt 0)
{
    Write-Host 'Complete with 1 error.'
}
else
{
    Write-Host 'Complete.'
}

Exit $errorCount
