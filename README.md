# Table Of Contents
- [Getting Started](#getting-started)
  * [Running the project](#running-the-project)
    + [Backend - Debug](#backend---debug)
    + [Backend - Run](#backend---run)
    + [Frontent - Debug](#frontent---debug)
    + [Frontent - Run](#frontent---run)
    + [Running Code in Visual Studio](#running-code-in-visual-studio)
    + [Running Code in VSCode](#running-code-in-vs-code)
  * [Remote Development](#remote-development)
  * [Design guidance](#design-guidance)
    + [Adding new Pages](#adding-new-pages)
    + [Adding new Routes](#adding-new-routes)
  * [Troubleshooting](#troubleshooting)
    + [Backend - nuget issues](#backend)
    + [Frontend - website issues](#frontend)
      + [Use specific version of node](#use-specific-version-of-node)
  * [Linting](#linting)
  * [Deploying](#deploying)
- [Current Branch policies](#current-branch-policies)
- [Build pipeline](#build-pipeline)
- [Overall code organization](#overall-code-organization)
  * [Server](#server)
  * [Client](#client)
- [React Docs](#react-docs)

# Getting Started
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) or [VS Code](https://code.visualstudio.com/)
- Install [node.js](https://nodejs.org/en/download/)
- Clone this repo
- Create a new branch with hyphenated naming convention e.g. `fix-main` or `add-tests`
- Go to Azure KeyVault page: [relondemandvault>appsettings](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/asset/Microsoft_Azure_KeyVault/Secret/https://relondemandvault.vault.azure.net/secrets/appsettings/644af47b6a344ee59e4f7fdc58c7fd6e)
- copy secret value, and paste it in a new file named  ```appsettings.json``` under `reliability-on-demand` folder<br>
-- File path should look like this: `{your repo path}\reliability.on.demand\reliability-on-demand\appsettings.json`
- do the same for `.env` file and add it under `ClientApp` 
- This is how the .env file looks after copying - 
"
BROWSER=
REACT_APP_ValidateFilterExpresionURL=
"
Separate the gap between Browser and REACT_APP_ValidateFilterExpresionURL with different lines
## Running the project
This repo contains both frontend ([React](https://reactjs.org/docs/hello-world.html)) and backend ([ASP.NET 5.0](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-5.0)) API.
### Backend - Debug
Follow these steps if you need to make a lot of API changes. 
1. Open solution reliability `reliability-on-demand.sln`
2. Make sure `IIS Express` is selected next to play button
3. Click `F5` 
4. Go to and endpoint like `http://localhost:8888/api/Data/GetAllTeamConfigs`
### Backend - Run
1. Open terminal at folder `reliability-on-demand`
2. `dotnet run`
### Frontent - Debug
1. Add the following to your `launch.json` if you don't have one already
```json
{
    "configurations": [
        {
            "type": "pwa-msedge",
            "name": "https://localhost:5001/",
            "request": "launch",
            "url": "https://localhost:5001/"
        }
    ]
}
```
2. Add a breakpoint to any typescript (`.tsx`or `.ts`) file 
3. Make sure you run `npm run start` first
4. Then press `F5`
5. If you need more details visit [Debugging React](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial#_debugging-react)

### Frontent - Run
1. Open terminal at folder `ClientApp`
2. `npm run start`

### Running Code in Visual Studio
Make sure you your Debug Configuration is set to the following: 
1. Configuration = Debug
2. Platform = Any CPU
3. Hit `F5` or Click the Green Run button
4. Set a breakpoint on any `.cs` or `.tsx` file and break on it

### Running Code in VSCode
1. Navigate to folder: reliability-on-demand
2. `Ctrl + Shift + P` and type `Tasks: Run Task`
3. Select `Start Full Project`
4. Open your browser and navigate to `http://localhost:3000/`
5. Start the application
6. Open Sources tab 
7. Navigate to desired file
8. Set a breakpoint and hit in the browser

#### Helpful links
1. [How to put an if-debug condition in C#](https://stackoverflow.com/questions/3056516/how-do-you-put-an-if-debug-condition-in-a-c-sharp-program)
2. [Set Debug and Release configurations in VS 2022](https://docs.microsoft.com/en-us/visualstudio/debugger/how-to-set-debug-and-release-configurations?view=vs-2022)
3. [Use Multiple Environments in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/environments?view=aspnetcore-6.0)
4. [dotnet run CLI arguments](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-run)

## Remote Development
A convenient way to develop is to set up SSH from your local machine --> remote machine (where you run the app).
Please follow the instructions [here](https://code.visualstudio.com/docs/remote/ssh) to set up VSCode SSH in a secure way.


## Design guidance
These were learnings from initial coding exercies. Keeping these in mind will make your coding experience a lot smoother and enjoyable 
1. Keep things Simple (KISS principle) - each function, method, component should have just 1 responsibility
2. Always use Functional components - why? it's easier to reason about compared to Class components, and it follows #1 above.

### Adding new Pages
1. When adding a new section, create a folder: like the Study folder. 
2. Add individual components like Dropdown or Combobos components into individual files. Copy them from [Fluent UI Web Controls](https://developer.microsoft.com/en-us/fluentui#/controls/web/combobox#overview) as is.
3. Rename the file to make it more relevant to the project
4. Use the newly added component in file labeled `<your-page>Section.tsx` like `StudySection.tsx`
5. This top level page should contain the data structures you'll modify based on user's selections. Each sub-component should have direct visibility to the data structures you create here. 

### Adding new Routes
1. If possbile (in most cases) use HttpGet (examples in `DataController.cs`)
2. Use [Conventional URL parameters](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#conventional-routing-1) for quick and easy testing 

## Troubleshooting 
### Backend
#### .NET Framework errors
If you see errors around **.net framework not found**
Download and install [.NET 5 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-5.0.408-windows-x64-installer)
- This will install the correct .NET framework in the location `C:\Program Files\dotnet`
#### Nuget Errors
If you see errors around **Nuget 401 Unauthorized** 
1. Delete `bin` and `obj` folders
2. On terminal `dotnet clean`
3. On terminal `nuget restore` (if you don't have nuget.exe get it from [here](https://microsoft.visualstudio.com/OS.Fun/_artifacts/feed/PhReliabilityCloud/connect/nuget.exe)). Visit Azure Artifacts link for [PHReliabilityCloud](https://microsoft.visualstudio.com/OS.Fun/_artifacts/feed/PhReliabilityCloud) for more details
3. On terminal `dotnet run`
4. If this still does not solve your errors - see [stackoverflow answer for nuget issues](https://stackoverflow.com/questions/41185443/nuget-connection-attempt-failed-unable-to-load-the-service-index-for-source)

### Frontend
If you run into issues where the website doesn't open up for you following these steps should help you recover:
1. Delete `package-lock.json` (not package.json!) and/or yarn.lock in your project folder.
2. Delete `node_modules` in your project folder.
3. Press F5 to do a clean run (which performs npm install) for you.

* use [React Developer Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) extension [for Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) and [for chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) to get a good view of the components, their state, and props passed in. 

Important link for fixing [react-scripts](https://github.com/facebook/create-react-app/issues/11174)
If you face any Component Governance issues in the build - [this is how you resolve them](https://onebranch.visualstudio.com/OneBranch/_wiki/wikis/OneBranch.wiki/4572/Component-Governance) 

#### Use specific version of node
Often you'll run into linting errors where you may need to use a later version of node than you have installed.
Read instructions for [nvm](https://github.com/coreybutler/nvm-windows) to download it.
**nuance: use Powershell in admin mode to run nvm** after installing it.

#### npm install authentication issues
If you haven't set up authentication to Azure Feed for all of our npm packages, please do so by visiting [How to connect to Azure Feed: PhReliabilityCloud](https://microsoft.visualstudio.com/OS.Fun/_artifacts/feed/PhReliabilityCloud/connect/npm)

## Linting
This project uses airbnb-base and airbnb-typescript rules for linting. Furthermore, [these instructions](https://gist.github.com/EliEladElrom/54c5046cf21877824d1bc38d5dd33d81) were used to configure linting.

## Deploying
### Staging slot
1. Please go to [Staging slot](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/b1ffe277-b0a8-466c-b97c-18bfa349594b/resourceGroups/riod_rg/providers/Microsoft.Web/sites/reliabilityondemand/slots/staging/appServices)
2. If this is the first time you're deploying - Download publishing profile. 
3. In Visual Studio right click `relaibility-on-demand`
4. Select Publish
5. Import the downloaded Publishing profile
6. Click Publish
7. On [Azure portal](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/b1ffe277-b0a8-466c-b97c-18bfa349594b/resourceGroups/riod_rg/providers/Microsoft.Web/sites/reliabilityondemand/slots/staging/appServices) 
8. Click Swap and ***swap the 2 slots*** to get your new changes into production!!!

### Testing slot
Same Steps as above except last one. Do not swap with production. 
Please go to [Testing slot](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/b1ffe277-b0a8-466c-b97c-18bfa349594b/resourceGroups/riod_rg/providers/Microsoft.Web/sites/reliabilityondemand/slots/testing/appServices)
Note: in Visual Studio you may have various publishing profiles. Make sure you pick the correct (testing) deployment profile. 

To check your deployment settings - visit [RIOD clarifications](https://microsoft.sharepoint.com/:p:/t/FUNREL/EYBcXW1xZPxAqrFw9cM5PzoBfQx6u0ti8KX159gTKFgk6g?e=8AQZn0) deployment slide.  

# Current Branch policies
1. You cannot make commits to main directly
2. You need to create PRs to pull in changes to main
3. Your PR needs to pass the build CI pipeline [reliability.on.demand](https://microsoft.visualstudio.com/OS.Fun/_build?definitionId=62545&_a=summary)<br>
4. PR may warn you if:
- you don't have a work item attached
- you don't haven't resolved all comments

These policies are in place to make sure we don't regress any functionality, and created in hopes of delivering quality code at a faster velocity following industry standards on web development :) ___Please do not change these policies unless you really need to___

You can view these policies at [Branch policy for main](https://microsoft.visualstudio.com/OS.Fun/_settings/repositories?_a=policiesMid&repo=df56f54f-6e05-4a43-befd-6e2d660cf7e1&refs=refs%2Fheads%2Fmain)

How to's? <br>
[Protect your Git branches with policies - Azure Repos | Microsoft Docs](https://docs.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops)
# Build pipeline
Current build pipeline [reliability.on.demand-PullRequest](https://microsoft.visualstudio.com/OS.Fun/_build?definitionId=73973)<br>
This is where you can make changes to YAML file that contains all the steps for a build pipeline. A [cool walk-through](https://www.youtube.com/watch?v=FFxww1-M25E&ab_channel=RahulNath) on creating a react app and testing it using the build pipeline. 

# Overall code organization
Here's the overall code flow + a few key points to keep in mind: <br>
## Server
Program.cs ---uses---> Startup.cs ---builds---> ASP .NET Core App
<br>Using [ASP.NET 5.0](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-5.0)
## Client
ClientApp/ --> index.tsx --> Layout.tsx --> components folder 
- components folder contains all isolated components
- each component has a both typescript + HTML 
- a component is transpiled (.tsx --> .js + html) using babel 

<br>

If you're interested in setting up VScode configs [youtube](https://www.youtube.com/watch?v=6VOUka1zGvk&t=192s&ab_channel=BetterDev) similar to what I used when I was creating this project: 


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

**Note** You may notice a mix of Javascript and Typescript files.<br> 
That's ok, Typescript is a superset of Javascript, and transpiles into Javascript  

# React Docs
You can find the most recent version of create-react-app guide [here](https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/README.md).
