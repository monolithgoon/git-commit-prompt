@echo off
export NODE_ENV="development" 
clear
git status
git log --oneline -5
echo Automating Git commit...
cd src
node index.js
git log --oneline -10
