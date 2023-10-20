import subprocess
import os
import argparse
from pprint import pprint

def clean(output):
    """
    Clean the output of a subprocess command by decoding it from bytes to utf-8, stripping whitespace, and splitting by newline.
    param output: output of a subprocess command
    return: cleaned output
    """
    return output.decode('utf-8').strip().split('\n')

def execute(command):
    """
    Execute a command using subprocess.check_output and return the cleaned output.
    param command: command to execute
    return: cleaned output
    """
    log("command",command)
    command_list = command.split(' ')
    output = subprocess.check_output(command_list)
    cleaned = clean(output)
    return cleaned

def get_commit_list(n):
    """
    Get a list of the last n commits using git log.
    param n: number of commits to get
    return: list of commits
    """
    command = f"git log --oneline -n {str(n)}"
    return execute(command)

def git_fetch_depth(n):
    """
    Fetch the last n commits using git fetch.
    """
    command = f"git fetch --depth={str(n)}"
    return execute(command)

def get_changed_files(n):
    """
    Get a set of unique files that have changed in the last n commits.
    If we don't have commits to look back to, fetch them.
    param n: number of commits to look back to
    return: set of unique files that have changed
    """
    log("debug",f'get_changed_files({n})')
    # make sure we have enough commits to compare
    past_commits = get_commit_list(n)
    # if there are less than n commits, we need to fetch again
    if len(past_commits) < n:
        git_fetch_depth(n)
        past_commits = get_commit_list(n)
        
    log("debug", f"Files in Past {n} commits list: {past_commits}")
    first = past_commits[0].split(' ')[0]
    log("debug",f'first (latest) commit: {first}')
    last = past_commits[-1].split(' ')[0]
    log("debug",f'last (earliest) commit: {last}')    
    # --diff-filter reference: 
    # A Added
    # C Copied
    # D Deleted
    # M Modified
    # R Renamed
    # T have their type (mode) changed
    # U Unmerged
    # X Unknown
    # B have had their pairing Broken
    # * All-or-none
    output = subprocess.check_output(f'git diff --name-only --diff-filter=AM {first} {last}') # git diff --name-only <current> <previous>
    unique_files = set(clean(output))
    return unique_files

def log(level:str = "debug",message:str = "default log message"):
    """
    Log a message with a specified level.
    param level: log level
    param message: log message
    """
    # learn more: https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#logging-command-format
    # echo "##[debug]Debug text"
    allowed = set(['debug','error','warning','command'])
    if(level in allowed):
        log_message = f'##[{level}]{message}'
        print(log_message)
    else:
        print(f'##[warning]Log level {level} not allowed. Use one of {allowed}')

# Description: identify any jobs (*.json) that have changed since last commit and pass them to the build pipeline to be deployed to Geneva Orchestrator
# Look at git log for past n commits. n is 2 by default, but can be passed in as an argument. 
# A larger n = longer look back period. Pasing in a larger n is ok becuase it will simply include more files that were changed, 
# and keep the intended behavior of the script == deploy latest content of the job. Since the same job has been deployed, the redployment will won't affect
# the job in Geneva Orchestrator.
#
# Default case: 
# Look back to 2 commits
# Get a list of files that have changed in the last 2 commits
# Filter to just lens jobs (files ending in .json and path: ./RIOD.lensorchestrator/)
# Set the pipeline variable $PathToLensJobs (comma separated list of jobs), and $DeployJobs = true 
# $DeployJobs = true will trigger Task: publish-to-geneva-orchestrator in the build pipeline
# $PathToLensJobs will be the comma separated list of jobs to publish to Geneva Orchestrator
if __name__ == '__main__':
    # Parse arguments: number of commits to look back to. By default we look back to 2 commits
    parser = argparse.ArgumentParser(description='Identify changed jobs.')
    parser.add_argument('-n', type=int, default=2, help='Number of commits to look back to')
    args = parser.parse_args()

    # Get changed files
    print(f"Looking back {args.n} commits")
    changed_files_list = get_changed_files(args.n)
    print(f"{len(changed_files_list)} files changed. List below:")
    pprint(changed_files_list)
    
    # Filter to files ending in .json and path: ./RIOD.lensorchestrator/
    print("Finding jobs aka filtering to files ending in .json and path: ./RIOD.lensorchestrator/")
    filtered_files = [file for file in changed_files_list if file.endswith('.json') and file.startswith('RIOD.lensorchestrator/')]
    print(f"Found {len(filtered_files)} jobs to publish to Geneva Orchestrator. List below:")
    pprint(filtered_files)
    filtered_files_str = ','.join(filtered_files)
    
    # Set the pipeline variable $PathToLensJobs and $DeployJobs picked up Task: publish-to-geneva-orchestrator in the build pipeline
    os.system(f'echo "##vso[task.setvariable variable=PathToLensJobs;]{filtered_files_str}"')
    if len(filtered_files) > 0:
        os.system(f'echo "##vso[task.setvariable variable=DeployJobs;]true"')
