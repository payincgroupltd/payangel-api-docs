# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the PayAngel API Documentation, built using Docusaurus 2. It serves as the official documentation for the PayAngel Disbursement API, providing developers with guides, reference materials, and code examples for integrating with the PayAngel payment services.

## Commands

### Installation

```bash
npm install
# or if using pnpm
pnpm install
```

### Development

```bash
npm start
# or
pnpm start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

### Building

```bash
npm run build
# or
pnpm run build
```

This command generates static content into the `build` directory that can be served using any static contents hosting service.

### Deployment

```bash
GIT_USER=<Your GitHub username> npm run deploy
# or
GIT_USER=<Your GitHub username> pnpm run deploy
```

This builds and deploys the site to GitHub Pages. Make sure to update the `docusaurus.config.js` file with the correct GitHub username and repository name before deploying.

### Other Commands

```bash
npm run clear     # Clear the Docusaurus cache
npm run serve     # Serve the built website locally
npm run swizzle    # Customize a Docusaurus theme component
npm run write-translations    # Generate translation files
npm run write-heading-ids     # Generate heading IDs for markdown files
```

## Architecture

The project follows the standard Docusaurus architecture:

1. **Content Structure**:
   - `/docs/api/`: Contains all API documentation as Markdown files
   - Content is organized into categories: authentication, disbursement, and language-specific examples

2. **Configuration**:
   - `docusaurus.config.js`: Main configuration file for the Docusaurus site
   - `sidebars.js`: Defines the sidebar navigation structure

3. **Customization**:
   - `/src/css/custom.css`: Custom CSS for styling the site
   - `/src/components/`: Custom React components
   - `/src/pages/`: Custom React pages, including the homepage

4. **Assets**:
   - `/static/`: Static assets like images and the favicon

## Documentation Structure

The documentation is organized as follows:

1. **Getting Started**:
   - Introduction to the API
   - Authentication details

2. **Disbursement API**:
   - Overview of disbursement capabilities
   - Single transaction endpoints
   - Bulk transaction endpoints
   - Status checking endpoints

3. **Code Samples**:
   - Examples in JavaScript, TypeScript, Golang, and Java

4. **Reference**:
   - Error codes and handling
   - Webhook integration

## Deployment Process

The site is configured to be deployed to GitHub Pages. Before deploying:

1. Update the `docusaurus.config.js` file with the correct:
   - GitHub username/organization
   - Repository name
   - Base URL

2. Push changes to the main branch
3. Run the deploy command with your GitHub username

The deployment process will create or update the `gh-pages` branch with the built website.