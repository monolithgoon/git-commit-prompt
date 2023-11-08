@echo off

clear
git status
git log --oneline -5
echo Automating Git commit...
node index.js
git log --oneline -10
