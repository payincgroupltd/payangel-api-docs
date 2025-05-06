#!/bin/bash

# Script to rename the project directory from standapp-api-docs to payangel-api-docs

# Go to the parent directory
cd ..

# Check if the destination directory already exists
if [ -d "payangel-api-docs" ]; then
  echo "Error: Directory 'payangel-api-docs' already exists."
  exit 1
fi

# Move the directory
mv standapp-api-docs payangel-api-docs

# Enter the new directory
cd payangel-api-docs

# Clear the .docusaurus cache
rm -rf .docusaurus

echo "Directory renamed successfully from 'standapp-api-docs' to 'payangel-api-docs'"
echo "The .docusaurus cache has been cleared to ensure all paths are updated on next build"
echo ""
echo "You can now run:"
echo "  cd ../payangel-api-docs"
echo "  pnpm start # to run the development server"
echo "  pnpm build # to build the site"