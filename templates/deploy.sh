#!/bin/bash

# 1. Run rendering check
echo "=== [Step 1] Running Blank Page & Runtime Error Verification ==="
npm test

if [ $? -ne 0 ]; then
  echo "❌ [Error] Local rendering validation failed! Deployment aborted to prevent a blank page."
  exit 1
fi

echo "✅ [Success] Rendering validation passed cleanly."

# 2. Ask user or commit automatically
echo "=== [Step 2] Deploying to GitHub ==="

# Read token
TOKEN_PATHS=(
  "/home/unowhat/project/gh_tk.txt"
  "/home/unowhat/project/gh_tk"
  "$(dirname "$PWD")/gh_tk.txt"
  "$(dirname "$PWD")/gh_tk"
  "/mnt/d/Storage/project/gh_tk.txt"
)

GH_TOKEN=""
for p in "${TOKEN_PATHS[@]}"; do
  if [ -f "$p" ]; then
    GH_TOKEN=$(cat "$p" | tr -d '\r\n')
    echo "🔑 Found GitHub Token at: $p"
    break
  fi
done

if [ -z "$GH_TOKEN" ]; then
  echo "❌ [Error] GitHub OAuth Token file not found in candidates!"
  exit 1
fi

# Check git status
git add .

# Set commit message
COMMIT_MSG="Auto-deploy verification passed: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

echo "Pushing changes to GitHub..."
git push https://$GH_TOKEN@github.com/unoShin/wedding-card.git main

echo "🎉 Deployment successfully completed! Verified no blank pages."
