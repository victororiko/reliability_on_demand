For any new workflow, if you want Canaveral to manage the deployment, please remove the version.
This repo contains 3 xflowproj files- 
	1. AllResources - used for deploying all the JSON and XSLT files.
	2. AllScripts - deploying all scripts
	3. AllViews - deploying all views
	4. AllWorkflows - deploying all workflows
Please check out these files to see what expression it uses to upload the files and also the ADLS path where it uploads the file. 

If you want to add a new script/resource/view that doesn't match with the existing pattern specified in the .xflowproj file or destination path in cosmos is different. 
Please add a new entry to the required xflowproj file.

Also, it refers to the resources only in this repo. If your workflow is referring to something outside the current repo, this repo is not responsible for the automatic deployment of that file.

Warning - As Canaveral is getting added to the full-fledged developed repo that has many workflows and resources to deploy, please make sure your resources are correctly covered in the xflowproj file.