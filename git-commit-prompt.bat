#! /usr/bin/env bash
@echo off

# Fn. to create a temporary directory named 'temp' for storing lists of staged & unstaged Git files

create_temp_dir() {

    # Determine null device based on the platform
    if [ "$(uname)" == "Darwin" ]; then
        devNull="/dev/null"
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        devNull="/dev/null"
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
        devNull="nul"
    else
        echo "Unsupported operating system"
        exit 1
    fi

    # Run the mkdir command and redirect stderr to the null device if "temp" already exits
    mkdir temp 2>"$devNull"
}

box_text() {
    local text="$1"
    local length=${#text}
    local width=40 # Adjust this value based on your desired width

    # Calculate padding for centering
    local padding=$(( (width - length) / 2 ))

    # Array of ANSI color codes
    local colors=("\e[1;31m" "\e[1;32m" "\e[1;33m" "\e[1;34m" "\e[1;35m" "\e[1;36m")

    # Select a random color from the array
    local random_color=${colors[$((RANDOM % ${#colors[@]}))]}

    # Draw the box with random color
    echo "┌────────────────────────────────────────┐"
    printf "${random_color}│%*s%s%*s│\e[0m\n" "$padding" "" "$text" "$padding" ""
    echo "└────────────────────────────────────────┘"
}


# Clear the console
clear

# Create "temp" directory
create_temp_dir

# List the names of files that have changed and save to 'temp/changed-files.txt'
git diff --name-only > temp/changed-files.txt

# Store files which have been staged with `git add` 
git status --short > temp/staged-files.txt

# List untracked files and save to 'temp/untracked-files.txt'
git ls-files --others --exclude-standard > temp/untracked-files.txt

# Set the NODE_ENV environment variable to "development"
export NODE_ENV="development"

# List all Git branches
box_text ".GIT BRANCH(S)  "
git branch

# Show details about the last commit
box_text "LATEST COMMIT "
git show --pretty=medium --abbrev-commit --no-patch

# Show the current Git status
box_text ".GIT STATUS   "
git status
git status --porcelain


box_text "> GIT COMMIT PROMPT UTILITY 🚀    "

# Display a message indicating the beginning of structuring Git commit messages

# Run the Node.js script located at 'src/index.js' for Git commit message structuring
node src/index.js

box_text "GIT LOG   "

# Display the last 10 commit messages in one line
git log --oneline -10
