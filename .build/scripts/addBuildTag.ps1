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
    [Parameter(Mandatory = $False)]
    [Alias("id")]
    [string] $BuildId = $env:BUILD_BUILDID,

    [Parameter(Mandatory = $True)]
    [string] $Tag,

    [Parameter(Mandatory = $False)]
    [Alias("org")]
    [string] $OrganizationName = 'microsoft',

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

[string] $AddBuildTagQuery = 'https://{0}.visualstudio.com/{1}/_apis/build/builds/{2}/tags/{3}?api-version=5.1'
[string] $TokenScope = '499b84ac-1321-427f-aa17-267ca6975798/.default'
[string] $AzurePowerShellClientId = '1950a258-227b-4e31-a9cf-717495945fc2'

##
##-------------------------------------------------------------------------------------------------
##

$exitCode = 0

##
## Check for required parameters.
##

if ([String]::IsNullOrEmpty($BuildId))
{
    Write-Host -ForegroundColor Red 'ERROR: Missing required BuildId parameter'
    Exit 1
}

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

        if ($null -eq (Get-InstalledModule -Name 'PowerShellGet' -RequiredVersion 2.2.4.1))
        {
            Write-Host -ForegroundColor Black -BackgroundColor Yellow 'From an elevated command prompt launch PowerShell and run:'
            Write-Host -ForegroundColor Black -BackgroundColor Yellow 'Install-Module -Name PowerShellGet -RequiredVersion 2.2.4.1 -Force'
        }

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

Write-Host "Adding build tag..."
Write-Host ''

Write-Host "  Build ID:  $BuildId"
Write-Host "  Tag:       $Tag"

$queryUri = $AddBuildTagQuery -f $OrganizationName, $ProjectName, $BuildId, $Tag

$response = Invoke-RestMethod -Method Put -ContentType "application/json" -Uri $queryUri -Headers @{Authorization=($authorizationHeader)}

if ($response -ne $null)
{
    Write-Host "Complete."
}
else
{
    Write-Host "Failed!"
    $exitCode = 1
}

Exit $exitCode
