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
    [string] $OutputFilePath,

    [Parameter(Mandatory = $False)]
    [Alias("root")]
    [string] $RootDirectory = $env:BUILD_SOURCESDIRECTORY,

    [Parameter(Mandatory = $False)]
    [Alias("filter")]
    [string] $FileNameFilter = '*',

    [Parameter(Mandatory = $False)]
    [Alias("id")]
    [string] $BuildId = $env:BUILD_BUILDID,

    [Parameter(Mandatory = $False)]
    [Alias("branch")]
    [string] $BranchName = $env:BUILD_SOURCEBRANCH,

    [Parameter(Mandatory = $False)]
    [Alias("head")]
    [string] $CurrentCommitHash = $env:BUILD_SOURCEVERSION,

    [Parameter(Mandatory = $False)]
    [Alias("project", "p")]
    [string] $ProjectName = 'OSGData',

    [Parameter(Mandatory = $False)]
    [Alias("t")]
    [string] $Token
)

##
##-------------------------------------------------------------------------------------------------
##

[string] $GetBuildByIdQuery = 'https://microsoft.visualstudio.com/{0}/_apis/build/builds/{1}?api-version=5.1'
[string] $LatestSuccessfulBuildQuery = 'https://microsoft.visualstudio.com/{0}/_apis/build/builds?definitions={1}&branchName={2}&queryOrder=finishTimeDescending&resultFilter=succeeded&$top=1&api-version=5.1'
[string] $TokenScope = '499b84ac-1321-427f-aa17-267ca6975798/.default'
[string] $AzurePowerShellClientId = '1950a258-227b-4e31-a9cf-717495945fc2'

##
##-------------------------------------------------------------------------------------------------
##

$exitCode = 0

##
## Check for required parameters.
##

if ([String]::IsNullOrEmpty($BranchName))
{
    Write-Host -ForegroundColor Red 'ERROR: Missing required BranchName parameter'
    Exit 1
}

##
## Set the root directory.
##

if ([String]::IsNullOrEmpty($RootDirectory))
{
    $RootDirectory = Get-Location
}

##
## Try to locate the commit hash from the last successful build.
##

$baselineCommitHash = ''

$usingBearerToken = $False

##
## Use the System.AccessToken environment variable, if present.
##

if ([String]::IsNullOrEmpty($env:SYSTEM_ACCESSTOKEN) -ne $True)
{
    Write-Host 'Using SYSTEM_ACCESSTOKEN'
    Write-Host ''

    $Token = $env:SYSTEM_ACCESSTOKEN
    $usingBearerToken = $True
}

##
## Otherwise, retrieve it from the user (useful for debugging locally).
##

if ([String]::IsNullOrEmpty($Token))
{
    if ($null -eq (Get-Module -ListAvailable -Name 'MSAL.PS'))
    {
        Write-Host -Foreground Yellow "MSAL.PS PowerShell module not found -- installing..."

        Install-Module MSAL.PS -Scope CurrentUser

        Write-Host -Foreground Yellow 'Complete.'
        Write-Host ''
    }

    if ($null -eq (Get-Module -ListAvailable -Name 'MSAL.PS'))
    {
        Write-Host -ForegroundColor Red 'Failed to install MSAL.PS module!'
        Write-Host 'If this error is unexpected, ensure you have the version 2 or greater of PowerShellGet installed.'
        Write-Host ''
        Write-Host 'From an elevated command prompt launch PowerShell and run:'
        Write-Host 'Install-Module -Name PowerShellGet -RequiredVersion 2.2.4.1 -Force'

        Exit 1
    }

    $Token = ''

    Write-Host "Authenticating to Azure DevOps..."

    $clientApplication = New-MsalClientApplication $AzurePowerShellClientId

    Add-MsalClientApplication $clientApplication

    $clientApplication = Enable-MsalTokenCacheOnDisk $clientApplication -PassThru

    $account = $clientApplication | Get-MsalAccount

    try
    {
        $authResult = $clientApplication | Get-MsalToken -Scope $TokenScope -Silent
    }
    catch
    {
        $authResult = $clientApplication | Get-MsalToken -Scope $TokenScope -Interactive
    }

    $Token = $authResult.AccessToken

    if ($Token -eq '')
    {
         Write-Host -ForegroundColor Red 'Authentication failed!'
         Exit 1
    }

    Write-Host 'Complete.'
    Write-Host ''

    $usingBearerToken = $True
}

##
## Construct our authorization header value.
##

$authorizationHeader = ''

if ($usingBearerToken)
{
    $authorizationHeader = "Bearer $Token"
}
else
{
    ##
    ## Convert the personal access token into base 64.
    ##
    ## Access tokens can be managed via https://microsoft.visualstudio.com/DefaultCollection/_details/security/tokens
    ##

    $base64authinfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes((":$($Token)")))

    $authorizationHeader = "Basic $base64authinfo"
}

##
## Get the build definition corresponding to the current build.
##

Write-Host "Querying for the latest successful build..."
Write-Host ''

Write-Host "  Current build ID: $BuildId"
Write-Host "  Current build branch $BranchName"

if ([String]::IsNullOrEmpty($CurrentCommitHash))
{
    ##
    ## Get the HEAD commit hash if we weren't given one.
    ##
    
    $CurrentCommitHash = $(git rev-parse HEAD)
}

Write-Host "  Current commit hash: $CurrentCommitHash"

$definitionId = ''

$queryUri = $GetBuildByIdQuery -f $ProjectName, $BuildId

$response = Invoke-RestMethod -Method Get -ContentType "application/json" -Uri $queryUri -Headers @{Authorization=($authorizationHeader)}

if ($response -ne $null)
{
    $definitionId = $response.definition.id

    Write-Host "  Build definition ID: $definitionId"
}
else
{
    Exit 1
}

##
## Now, try to find the last successful build for that definition and, if found, get the
## corresponding commit hash.
##

$queryUri = $LatestSuccessfulBuildQuery -f $ProjectName, $definitionId, $BranchName

$response = Invoke-RestMethod -Method Get -ContentType "application/json" -Uri $queryUri -Headers @{Authorization=($authorizationHeader)}

if ($response.value.length -gt 0)
{
    Write-Host "  Latest successful build ID: $($response.value[0].id)"

    $baselineCommitHash = $response.value[0].sourceVersion

    Write-Host "  Latest successful commit: $baselineCommitHash"
}
else
{
    Write-Host '  No matching successful build found'
}

Write-Host ''
Write-Host 'Complete.'
Write-Host ''

$modifiedFiles = New-Object List[string]

##
## If we were trying to only stage modified files but no baseline commit hash can be found, switch
## to staging all matching files.
##

if ($baselineCommitHash -eq '')
{
    Write-Host 'No baseline commit hash available'
    Write-Host ''
}
else
{
    ##
    ## Stage only matching files that have been modified since the baseline commit.
    ##

    $commandOutput = $(git diff-tree --no-commit-id --name-only --diff-filter=ACMRT -r $baselineCommitHash $CurrentCommitHash $FileNameFilter)

    if ([String]::IsNullOrEmpty($commandOutput))
    {
        Write-Host "No matching files were modified"
    }
    elseif ($commandOutput -is [array])
    {
        ##
        ## If multiple files were modified, the return value is an array of file paths.
        ##

        Write-Host "Found $($commandOutput.Length) matching modified files:"
        Write-Host ''

        foreach ($file in $commandOutput)
        {
            Write-Host "  $file"
            $modifiedFiles.Add($file)
        }
    }
    else
    {
        ##
        ## If only a single file was modified, the return value is the file path.
        ##

        Write-Host "Found 1 matching modified file:"
        Write-Host ''
        Write-Host "  $commandOutput"

        $modifiedFiles.Add($commandOutput)
    }
}

Write-Host ''

##
## If we have modified files, write the list to the output file.
##

if (Test-Path -LiteralPath $OutputFilePath)
{
    Remove-Item $OutputFilePath
}

New-Item -Type File -Path $OutputFilePath | Out-Null

foreach ($modifiedFile in $modifiedFiles)
{
    $modifiedFilePath = [Path]::Combine($RootDirectory, $modifiedFile.Replace('/', '\'))

    Add-Content $OutputFilePath "$modifiedFilePath"
}

Write-Host -ForegroundColor DarkGray "##vso[task.setvariable variable=ModifiedFilesCount;]$($modifiedFiles.Count)"

Exit $exitCode
