#! /usr/bin/env bash

@echo off

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

# Create a temporary directory named 'temp'
mkdir temp

# List the names of files that have changed and save to 'temp/changed-files.txt'
git diff --name-only > temp/changed-files.txt

# List untracked files and save to 'temp/untracked-files.txt'
git ls-files --others --exclude-standard > temp/untracked-files.txt

# Set the NODE_ENV environment variable to "development"
export NODE_ENV="development"

# List all Git branches
box_text ".GIT BRANCHES "
git branch

# Show details about the last commit
box_text ".GIT SHOW "
git show --pretty=medium --abbrev-commit --no-patch

# Show the current Git status
box_text ".GIT STATE    "
git status

# Display a message indicating the beginning of structuring Git commit messages
echo ""
echo Structuring Git commit message...
echo ""

box_text "> GIT COMMIT PROMPT UTILITY   "
echo ""

# Run a Node.js script located at 'src/index.js' for Git commit message structuring
node src/index.js

# Display the last 10 commit messages in one line
git log --oneline -10
