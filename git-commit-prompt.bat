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


clear
git diff --name-only > temp/changed-files.txt
git ls-files --others --exclude-standard > temp/untracked-files.txt
export NODE_ENV="development" 
box_text ".GIT BRANCHES "
git branch
box_text ".GIT SHOW "
git show --pretty=medium --no-patch
box_text ".GIT STATE  "
git status
@REM git log --oneline -5
echo ``
echo Structuring Git commit message...
echo ``
box_text "> GIT COMMIT PROMPT UTILITY "
echo ``
cd src
node index.js
git log --oneline -10
