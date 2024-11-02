#!/bin/bash

# Check git status for untracked or modified files
status=$(git status --porcelain)

if [[ -n $status ]]; then
  echo "There are untracked or modified files."
  
  # Use git add to stage the files
  git add .

  echo "Files added to staging area."

  # Prompt user for a commit message
  read -p "Enter a commit message: " commit_message
  git commit -m "$commit_message"
  echo "Changes committed with message: $commit_message"

else
  echo "No files to add or commit."
fi

# Prompt user for the branch to push to
read -p "Enter the branch to git push to: " branch
git push origin "$branch"
echo "Changes pushed to branch: $branch"
