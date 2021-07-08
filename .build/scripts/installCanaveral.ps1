##-------------------------------------------------------------------------------------------------
##
## Copyright (c) Microsoft Corporation.  All rights reserved.
##
##-------------------------------------------------------------------------------------------------

[CmdletBinding()]
Param
(
    [Parameter(Mandatory = $True, Position = 0)]
    [string] $TargetDirectory,

    [Parameter(Mandatory = $False)]
    [Alias("t")]
    [string] $Token,

    [Parameter(Mandatory = $False)]
    [Alias("package", "p")]
    [string] $PackageName = 'Canaveral',

    [Parameter(Mandatory = $False)]
    [Alias("q")]
    [string] $Quality = 'Release',

    [Switch]
    [Alias("ado")]
    [bool] $SetAdoVariables
)

##
##-------------------------------------------------------------------------------------------------
##

[string] $LatestPackageVersionsByNameQuery = 'https://microsoft.feeds.visualstudio.com/_apis/packaging/Feeds/Canaveral/packages?protocolType=nuget&packageNameQuery={0}&getTopPackageVersions=true&includeAllVersions=true&$top={1}&$skip={2}&api-version=5.1-preview.1'
[string] $FeedSource = 'https://microsoft.pkgs.visualstudio.com/_packaging/Canaveral/nuget/v3/index.json'
[string] $TokenScope = '499b84ac-1321-427f-aa17-267ca6975798/.default'
[string] $AzurePowerShellClientId = '1950a258-227b-4e31-a9cf-717495945fc2'

[int] $NumberOfTopBuilds = 10

##
##-------------------------------------------------------------------------------------------------
##

function Main()
{
    $usingBearerToken = $False

    ##
    ## If no token has been passed by the caller and the System.AccessToken environment variable is present, use the System.AccessToken.
    ## If no token has been passed by the caller and the System.AccessToken environment variable isn't present, fetch a token.
    ##

    if ([String]::IsNullOrEmpty($Token) -and [String]::IsNullOrEmpty($env:SYSTEM_ACCESSTOKEN) -ne $True)
    {
        Write-Host 'Using SYSTEM_ACCESSTOKEN'
        Write-Host ''

        $Token = $env:SYSTEM_ACCESSTOKEN
        $usingBearerToken = $True
    }
    elseif ([String]::IsNullOrEmpty($Token))
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
    ## Get the latest Canaveral package version from the NuGet feed.
    ##

    $latestReleaseVersion = GetLatestPackageVersion $Token $usingBearerToken

    if ($latestReleaseVersion -eq '')
    {
        Write-Host "No matching $Quality package version found"
        Exit 1
    }

    ##
    ## Install the latest package version.
    ##

    $canaveralPackageDirectory = InstallPackage $latestReleaseVersion

    if ($canaveralPackageDirectory -eq '')
    {
        Write-Host 'Failed to install package!'
        Exit 1
    }

    ##
    ## Emit the full install path for the package.
    ##

    if ($SetAdoVariables)
    {
        Write-Host -ForegroundColor DarkGray "##vso[task.setvariable variable=CanaveralToolsDirectory;]$canaveralPackageDirectory"
    }

    $env:CanaveralToolsDirectory = $canaveralPackageDirectory

    Exit 0
}


##-------------------------------------------------------------------------------------------------
##
## Gets the latest version of the package.
##
##-------------------------------------------------------------------------------------------------

function GetLatestPackageVersion([string] $accessToken, [bool] $usingBearerToken)
{
    Write-Host "Locating latest $Quality version of $PackageName..."

    ##
    ## Construct our authorization header value.
    ##

    $authorizationHeader = ''

    if ($usingBearerToken)
    {
        $authorizationHeader = "Bearer $accessToken"
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
    ## Get the latest package versions for the specified feed/package.
    ##

    $skip = 0

    while ($True)
    {
        $queryUri = $LatestPackageVersionsByNameQuery -f $PackageName, $NumberOfTopBuilds, $skip

        $response = Invoke-RestMethod -Method Get -ContentType "application/json" -Uri $queryUri -Headers @{Authorization=($authorizationHeader)}

        if ($response.value.length -gt 0)
        {
            foreach ($package in $response.value)
            {
                if ($package.name -eq $PackageName)
                {
                    foreach ($packageVersion in $package.versions)
                    {
                        foreach ($view in $packageVersion.views)
                        {
                            if ($view.name -eq $Quality)
                            {
                                $latestVersion = $packageVersion.normalizedVersion

                                Write-Host "Complete (Latest version = $latestVersion)."
                                Write-Host ''

                                return $latestVersion
                            }
                        }
                    }
                }
            }

            $skip += $NumberOfTopBuilds
        }
        else
        {
            Write-Host -ForegroundColor Red 'Failed!'
            Write-Host ''
            Write-Host '--- Response ------------------------------------------------------------------'
            Write-Host -ForegroundColor DarkGray $response
            Write-Host '-------------------------------------------------------------------------------'

            break
        }
    }

    return ''
}


##-------------------------------------------------------------------------------------------------
##
## Install the NuGet package to the target directory.
##
##-------------------------------------------------------------------------------------------------

function InstallPackage([string] $packageVersion)
{
    $canaveralPackageDirectory = "$TargetDirectory\$PackageName.$packageVersion"

    ##
    ## See whether the latest package is already installed and, if not, install it.
    ##

    if (Test-Path -Path "$canaveralPackageDirectory\CanaveralBuildTasks.dll")
    {
        Write-Host "$PackageName version $packageVersion already installed."
        Write-Host ''
    }
    else
    {
        Write-Host "Installing $PackageName version $packageVersion to $TargetDirectory..."

        $nugetOutput = ''

        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "$PSScriptRoot\..\tools\nuget\nuget.exe"
        $processInfo.RedirectStandardError = $True
        $processInfo.RedirectStandardOutput = $True
        $processInfo.UseShellExecute = $False
        $processInfo.Arguments = "install $PackageName -Version $packageVersion -Source $FeedSource -OutputDirectory ""$TargetDirectory"""

        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo

        $process.Start() | Out-Null
        $process.WaitForExit()

        $nugetOutput += $process.StandardOutput.ReadToEnd()
        $nugetOutput += $process.StandardError.ReadToEnd()
        $nugetOutput = $nugetOutput.Trim()

        if ($process.ExitCode -eq 0)
        {
            Write-Host 'Complete.'
            Write-Host ''
        }
        else
        {
            Write-Host -ForegroundColor Red 'Failed!'
            Write-Host ''
            Write-Host '--- NuGet Output --------------------------------------------------------------'
            Write-Host -ForegroundColor DarkGray $nugetOutput
            Write-Host '-------------------------------------------------------------------------------'
            Write-Host ''

            return ''
        }
    }

    ##
    ## Clean up any older versions of the package that are still around.
    ##

    $foundOlderVersions = $False

    $packageDirectories = Get-ChildItem -Path $TargetDirectory -Directory

    foreach ($packageDirectory in $packageDirectories)
    {
        if ($packageDirectory.Name.StartsWith("$PackageName."))
        {
            $versionString = $packageDirectory.Name.Substring("$PackageName.".Length)

            $parsedVersion = New-Object System.Version

            if (($versionString -ne $packageVersion) -and ([Version]::TryParse($versionString, [ref] $parsedVersion)))
            {
                if ($foundOlderVersions -eq $False)
                {
                    Write-Host 'Removing older package versions...'
                    $foundOlderVersions = $True
                }

                Remove-Item $packageDirectory.FullName -Recurse
            }
        }
    }

    if ($foundOlderVersions)
    {
        Write-Host 'Complete.'
        Write-Host ''
    }

    return $canaveralPackageDirectory

}

##
##-------------------------------------------------------------------------------------------------
##

Main