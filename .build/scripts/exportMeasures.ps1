##-------------------------------------------------------------------------------------------------
##
## Copyright (c) Microsoft Corporation.  All rights reserved.
##
##-------------------------------------------------------------------------------------------------

using namespace System.Collections.Generic

[CmdletBinding()]
Param
(
    [Parameter(Mandatory = $false, Position = 0)]
    [string] $ExportDirectory = '.',

    [Parameter(Mandatory = $false)]
    [Alias("listFile", "file", "f")]
    [string] $MeasureIdListFile = '',

    [Parameter(Mandatory = $false)]
    [Alias("id")]
    [string] $MeasureId = '',

    [Parameter(Mandatory = $false)]
    [Alias("t")]
    [string] $Token
)

##
##-------------------------------------------------------------------------------------------------
##

[string] $MissionControlClientId = '752155b8-0b09-42b4-ab74-9fb7db60db57'
[string] $TokenScope = 'https://missioncontrol/.default'

##
## Build the list of Measure IDs to export.
##

$exportMeasureIds = New-Object List[int]

##
## Parse the input file of IDs, if present.
##

if ([String]::IsNullOrEmpty($MeasureIdListFile) -eq $False)
{
    Write-Host "Parsing measure IDs from input file $MeasureIdListFile..."

    if ((Test-Path -Path $MeasureIdListFile) -eq $False)
    {
        Write-Host -ForegroundColor Red "ERROR: File not found ($MeasureIdListFile)"
        Exit 1
    }

    $lines = Get-Content -Path $MeasureIdListFile

    foreach ($line in $lines)
    {
        $trimmedLine = $line.Trim()

        if ($trimmedLine.Length -eq 0)
        {
            continue
        }

        $intValue = 0

        if ([Int32]::TryParse($trimmedLine, [ref] $intValue) -eq $False)
        {
            Write-Host -ForegroundColor Red "ERROR: Invalid measure ID in file ($trimmedLine)"
            Exit 1
        }
        else
        {
            if ($exportMeasureIds.Contains($intValue) -eq $False)
            {
                $exportMeasureIds.Add($intValue)
            }
        }
    }

    Write-Host 'Complete.'
    Write-Host ''
}

##
## Parse the ID passed on the command line, if present.
##

if ([String]::IsNullOrEmpty($MeasureId) -eq $False)
{
    $intValue = 0

    if ([Int32]::TryParse($Measureid, [ref] $intValue) -eq $False)
    {
        Write-Host -ForegroundColor Red "ERROR: Invalid measure ID ($MeasureID)"
        Exit 1
    }
    else
    {
        if ($exportMeasureIds.Contains($intValue) -eq $False)
        {
            $exportMeasureIds.Add($intValue)
        }
    }
}

if ($exportMeasureIds.Count -eq 0)
{
    Write-Host 'No measure IDs to export - exiting'
    Exit 0
}
elseif ($exportMeasureIds.Count -eq 1)
{
    Write-Host "Measure ID to export: $($exportMeasureIds[0])"
}
else
{
    Write-Host 'Measure IDs to export:'

    foreach ($exportMeasureId in $exportMeasureIds)
    {
        Write-Host "  $exportMeasureId"
    }
}

Write-Host ''

##
## Handle authentication.
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
        Write-Host -ForegroundColor Cyan 'From an elevated command prompt launch PowerShell and run:'
        Write-Host -ForegroundColor Cyan 'Install-Module -Name PowerShellGet -RequiredVersion 2.2.4.1 -Force'

        Exit 1
    }

    $Token = ''

    Write-Host "Authenticating to Mission Control..."

    $clientApplication = New-MsalClientApplication $MissionControlClientId -RedirectUri 'urn:ietf:wg:oauth:2.0:oob'

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
## Install the Newtonsoft module, if not alreday installed.
##

if ($null -eq (Get-Module -ListAvailable -Name 'newtonsoft.json'))
{
    Write-Host -Foreground Yellow "Newtonsoft.Json PowerShell module not found -- installing..."

    Install-Module newtonsoft.json -Scope CurrentUser

    Write-Host -Foreground Yellow 'Complete.'
    Write-Host ''
}

if ($null -eq (Get-Module -ListAvailable -Name 'newtonsoft.json'))
{
    Write-Host -ForegroundColor Red 'Failed to install Newtonsoft.Json module!'

    Exit 1
}

foreach ($exportMeasureId in $exportMeasureIds)
{
    Write-Host "Exporting measure $exportMeasureId..."

    ##
    ## Get the latest package versions for the specified feed/package.
    ##

    $queryUri = "https://mission-control-api.azurewebsites.net/api/measureconfiguration/vsts:{0}" -f $MeasureId

    $response = Invoke-RestMethod -Method Get -ContentType "application/json" -Uri $queryUri -Headers @{Authorization=($authorizationHeader)}

    Write-Host 'Complete.'
    Write-Host ''

    ##
    ## Remove transient properties from the measure definition.
    ##
    ## NB: The code should stay in sync with the implementation in Canaveral.
    ##

    $response.measureDefinition.PSObject.Properties.Remove('publishDate')

    $response.measureDefinition.pipelineConfig.PSObject.Properties.Remove('designer')
    $response.measureDefinition.pipelineConfig.PSObject.Properties.Remove('publishDate')
    ##$response.measureDefinition.pipelineConfig.PSObject.Properties.Remove('majorVersion')
    ##$response.measureDefinition.pipelineConfig.PSObject.Properties.Remove('minorVersion')

    $response.measureDefinition.pipelineConfig.uberScenario.PSObject.Properties.Remove('designer')
    $response.measureDefinition.pipelineConfig.uberScenario.diagscenario.scenario.PSObject.Properties.Remove('scenarioid')
    $response.measureDefinition.pipelineConfig.uberScenario.diagscenario.scenariodb.scenariometadata.PSObject.Properties.Remove('requesteddeploymentdate')

    foreach ($instanceMetric in $response.measureDefinition.pipelineConfig.uberScenario.scenariometrics.instancemetrics)
    {
        $instanceMetric.PSObject.Properties.Remove('guid')
    }

    if ($response.customDimensions -ne $Null)
    {
        $response.customDimensions.PSObject.Properties.Remove('modifiedUtcTime')
    }

    if ($response.confidenceIntervalSettings -ne $Null)
    {
        $response.confidenceIntervalSettings.PSObject.Properties.Remove('modifiedUtcTime')
    }

    $response.PSObject.Properties.Remove('canaveralData')

    $response.PSObject.Properties.Remove('revision')
    $response.PSObject.Properties.Remove('sections')
    $response.PSObject.Properties.Remove('_ts')
    $response.PSObject.Properties.Remove('updatedByUpn')

    ##
    ## Round-trip the JSON content through Newtonsoft to give us the formatting we want.
    ##

    $json = ConvertTo-Json $response -Depth 100

    $newtonsoftObject = ConvertFrom-JsonNewtonsoft $json

    $json = ConvertTo-JsonNewtonsoft $newtonsoftObject

    ##Write-Host '-------------------------------------------------------------------------------------------------'
    ##Write-Host $json
    ##Write-Host '-------------------------------------------------------------------------------------------------'

    $outputFilePath = "$ExportDirectory\MC_Measure_$exportMeasureId.json"

    Write-Host "Saving output to $outputFilePath..."
    Set-Content -Path $outputFilePath -Value $json
    Write-Host 'Complete.'
    Write-Host ''
}
