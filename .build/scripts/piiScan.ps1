##-------------------------------------------------------------------------------------------------
##
## Copyright (c) Microsoft Corporation.  All rights reserved.
##
##-------------------------------------------------------------------------------------------------

using namespace System.Collections.Generic
using namespace System.IO
using namespace System.Text.RegularExpressions

[CmdletBinding()]
Param
(
    [Parameter(Mandatory = $false, Position = 0)]
    [string] $RootDirectory = '',

    [Parameter(Mandatory = $false)]
    [Alias("ignore")]
    [string] $IgnoreListFilePath = '',

    [Parameter(Mandatory = $false)]
    [Alias("warn")]
    [switch] $LogErrorsAsWarnings = $False,
    
    [Switch]
    [bool] $ShowIgnored = $False,    

    [Switch]
    [Alias("ado")]
    [bool] $UseAdoLogging = $False
)

##
##-------------------------------------------------------------------------------------------------
##

[string[]] $DefaultIgnoreDirectoryNames = @('Packages', 'Bin', 'Debug', 'CodeGen')
[string[]] $DefaultIgnoreFileExtensions = @('.dll', '.exe', '.sys', '.pdb', '.jpg', '.png')
[string[]] $DefaultIgnoreIdentifiers = @('a:0000000000000000')

[string] $DeviceIdPattern = '^(?!gui)[ghmsdraxiuc][:][0-9A-F]{8}[-]+([0-9A-F]{4}[-]?){3}[0-9A-F]{12}|[ghmsdraxiuc][:][0-9]{16}'
[string] $UserIdPattern = '^(?!range)(?!a:{0})[pxtamwjsdgciefn][:][0-9]{15}'

[string] $LogLevel = if ($LogErrorsAsWarnings) { 'warning' } else { 'error' }
[int] $MaxCharactersToRead = 1024 * 1024  ## 1 MiB

[Regex] $DeviceIdRegex = New-Object Regex -ArgumentList $DeviceIdPattern, ([RegexOptions]::IgnoreCase -bor [RegexOptions]::Compiled)
[Regex] $UserIdRegex = New-Object Regex -ArgumentList $UserIdPattern, ([RegexOptions]::IgnoreCase -bor [RegexOptions]::Compiled)

[List[string]] $IgnoreDirectoryNames = New-Object List[string]
[List[string]] $IgnoreFileExtensions = New-Object List[string]
[List[string]] $IgnoreFileNames = New-Object List[string]
[List[string]] $IgnoreIdentifiers = New-Object List[string]

[char[]] $StreamBuffer = [System.Array]::CreateInstance([char], $MaxCharactersToRead)

[int] $global:ScannedFileCount = 0
[int] $global:ErrorCount = 0

##
##-------------------------------------------------------------------------------------------------
##

function Main()
{
    ##
    ## Use the current directory if no root directory was specified.
    ##
    
    if ($RootDirectory -eq '')
    {
        $RootDirectory = [Directory]::GetCurrentDirectory()
    }
    
    $RootDirectory = [Path]::GetFullPath($RootDirectory)
    
    ##
    ## Initialize our list of ignore parameters.
    ##

    $IgnoreDirectoryNames.AddRange($DefaultIgnoreDirectoryNames)
    
    for ($index = 0; $index -lt $IgnoreDirectoryNames.Count; $index++)
    {
        $IgnoreDirectoryNames[$index] = $IgnoreDirectoryNames[$index].ToLower()
    }
    
    $IgnoreFileExtensions.AddRange($DefaultIgnoreFileExtensions)
 
    for ($index = 0; $index -lt $IgnoreFileExtensions.Count; $index++)
    {
        $IgnoreFileExtensions[$index] = $IgnoreFileExtensions[$index].ToLower()
    }

    $IgnoreIdentifiers.AddRange($DefaultIgnoreIdentifiers)
 
    for ($index = 0; $index -lt $IgnoreIdentifiers.Count; $index++)
    {
        $IgnoreIdentifiers[$index] = $IgnoreIdentifiers[$index].ToLower()
    }
    
    ##
    ## If the user supplied an ignore list file, load it and add its entries to our lists.
    ##

    if ([String]::IsNullOrEmpty($IgnoreListFilePath) -eq $False)
    {
        if ([File]::Exists($IgnoreListFilePath) -eq $True)
        {
            $ignoreEntries = Get-Content $IgnoreListFilePath | ConvertFrom-Json

            if ($null -ne $ignoreEntries.IgnoreDirectories)
            {
                foreach ($ignoreDirectory in $ignoreEntries.IgnoreDirectories)
                {
                    $newValue = $ignoreDirectory.ToLower()
                    
                    if ($IgnoreDirectoryNames.Contains($newValue) -eq $False)
                    {
                        $IgnoreDirectoryNames.Add($newValue)
                        Write-Host -ForegroundColor DarkGray "  Added ignore directory $newValue"
                    }
                }
            }

            if ($null -ne $ignoreEntries.IgnoreFiles)
            {
                foreach ($ignoreFile in $ignoreEntries.IgnoreFiles)
                {
                    $newValue = $ignoreFile.ToLower()
                    
                    if ($IgnoreFileNames.Contains($newValue) -eq $False)
                    {
                        $IgnoreFileNames.Add($newValue)
                        Write-Host -ForegroundColor DarkGray "  Added ignore file $newValue"
                    }
                }
            }

            if ($null -ne $ignoreEntries.IgnoreFileExtensions)
            {
                foreach ($ignoreFileExtension in $ignoreEntries.IgnoreFileExtensions)
                {
                    $newValue = $ignoreFileExtension.ToLower()
                    
                    if ($newValue.StartsWith('.') -eq $False)
                    {
                        $newValue = '.' + $newValue
                    }

                    if ($IgnoreFileExtensions.Contains($newValue) -eq $False)
                    {
                        $IgnoreFileExtensions.Add($newValue)
                        Write-Host -ForegroundColor DarkGray "  Added ignore file extension $newValue"
                    }
                }
            }
        }
    }

    ##
    ## Start scanning from the root directory.
    ##
 
    Write-Host "Scanning files under $RootDirectory..."
    
    $startTime = [DateTime]::Now

    scanSubdirectories $RootDirectory

    $elapsedTime = [DateTime]::Now - $startTime
    
    if ($global:ErrorCount -gt 1)
    {
        Write-Host "Complete with $global:ErrorCount errors."
    }
    elseif ($global:ErrorCount -gt 0)
    {
        Write-Host 'Complete with 1 error.'
    }
    else
    {
        Write-Host 'Complete.'
    }

    Write-Host ''
    Write-Host "Scanned $global:ScannedFileCount file(s), elapsed time = $($elapsedTime.TotalSeconds) seconds"

    Exit $global:ErrorCount
}


function logMatches([MatchCollection] $matches, [string] $fileName, [string] $fileContents, [string] $matchType)
{
    $foregroundColor = if ($LogLevel -eq 'error') { [ConsoleColor]::Red } else { [ConsoleColor]::Yellow }

    foreach ($match in $matches)
    {
        ##
        ## Ignore the special case identifiers.
        ##

        if ($IgnoreIdentifiers.Contains($match))
        {
            continue
        }

        $lineNumber = [System.Linq.Enumerable]::Count([System.Linq.Enumerable]::Take($fileContents, $match.Index), [Func[char, bool]]{ param($c) $c -eq "`n" }) + 1
        $previousLineEndIndex = $fileContents.LastIndexOf("`n", $match.Index)
        $columnNumber = if ($previousLineEndIndex -ge 0) { $match.Index - $previousLineEndIndex } else { $match.Index + 1 }

        if ($UseAdoLogging)
        {
            Write-Host "##vso[task.logissue type=$LogLevel;sourcepath=$($fileInfo.FullName);linenumber=$lineNumber;columnnumber=$columnNumber;] NGP Error found $matchType ($match)."
        }
        else
        {
            Write-Host -ForegroundColor $foregroundColor "  $($LogLevel.ToUpper()): NGP Error found $matchType ($match) [$($fileInfo.FullName), line $lineNumber, column $columnNumber]"
        }
        
        if ($LogLevel -eq 'error')
        {
            $global:ErrorCount++
        }
    }
}


function scanSubdirectories([string] $directory)
{
    $subdirectories = Get-ChildItem -Path $directory -Directory

    foreach ($subdirectory in $subdirectories)
    {
        ##
        ## Ignore directories in the ignore list.
        ##
        
        if ($IgnoreDirectoryNames.Contains($subdirectory.Name.ToLower()))
        {
            if ($ShowIgnored)
            {
                Write-Host -ForegroundColor DarkGray "  Ignoring directory $($subdirectory.FullName) due to directory name filter"
            }

            continue
        }
        
        ##
        ## Enumerate the files in the subdirectory.
        ##
        
        $fileInfos = Get-ChildItem -Path $subdirectory.FullName -File

        foreach ($fileInfo in $fileInfos)
        {
            ##
            ## Skip files we can't read.
            ##

            $isFileReadable = (($fileInfo.Attributes -band [FileAttributes]::Encrypted) -ne [FileAttributes]::Encrypted -and
                               ($fileInfo.Attributes -band [FileAttributes]::Temporary) -ne [FileAttributes]::Temporary -and
                               ($fileInfo.Attributes -band [FileAttributes]::Offline) -ne [FileAttributes]::Offline -and
                               ($fileInfo.Attributes -band [FileAttributes]::Hidden) -ne [FileAttributes]::Hidden -and
                               ($fileInfo.Attributes -band [FileAttributes]::System) -ne [FileAttributes]::System)

            if ($isFileReadable -eq $False)
            {
                continue
            }

            ##
            ## Ingore files with extensions in the ignore list.
            ##

            if ($IgnoreFileExtensions.Contains([Path]::GetExtension($fileInfo.FullName).ToLower()))
            {
                if ($ShowIgnored)
                {
                    Write-Host -ForegroundColor DarkGray "  Ignoring file $($fileInfo.FullName) due to file extension filter"
                }

                continue
            }

            ##
            ## Ingore files with names in the ignore list.
            ##

            if ($IgnoreFileNames.Contains($fileInfo.Name.ToLower()))
            {
                if ($ShowIgnored)
                {
                    Write-Host -ForegroundColor DarkGray "  Ignoring file $($fileInfo.FullName) due to file name filter"
                }

                continue
            }

            ##
            ## Read in the file contents up to the maximum allowed length.
            ##

            $streamReader = $null
            $fileContents = $null

            try
            {
                $streamReader = New-Object StreamReader -ArgumentList $fileInfo.FullName
                
                $readCount = $streamReader.ReadBlock($StreamBuffer, 0, $StreamBuffer.Length)

                $fileContents = New-Object System.String -ArgumentList $StreamBuffer, 0, $readCount
                
                $global:ScannedFileCount++
            }
            finally
            {
                if ($null -ne $streamReader)
                {
                    $streamReader.Dispose()
                    $streamReader = $null
                }
            }

            ##
            ## Look for device and user IDs.
            ##

            $deviceIdMatches = $DeviceIdRegex.Matches($fileContents)
            $userIdMatches = $UserIdRegex.Matches($fileContents)

            ##
            ## Log errors (or warnings) for any issues we found.
            ##

            if ($deviceIdMatches.Count -gt 0)
            {
                logMatches $deviceIdMatches $fileInfo.FullName $fileContents "DeviceID"
            }

            if ($userIdMatches.Count -gt 0)
            {
                logMatches $userIdMatches $fileInfo.FullName $fileContents "DeviceID"
            }
        }
        
        ##
        ## Now, continue processing any other subdirectories.
        ##
        
        scanSubdirectories $subdirectory.FullName
    }
}

##
##-------------------------------------------------------------------------------------------------
##

Main