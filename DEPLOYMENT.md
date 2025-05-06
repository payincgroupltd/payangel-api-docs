# Deploying to GitHub Pages

This document provides step-by-step instructions for deploying the PayAngel API documentation to GitHub Pages.

## Prerequisites

1. Create a GitHub account if you don't have one.
2. Create a new GitHub repository for this project.
3. Ensure you have Git installed on your local machine.
4. Make sure you have Node.js (version 16.14 or higher) installed.

## Setup

1. Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/payangel-api-docs.git
cd payangel-api-docs
```

2. Install dependencies:

```bash
npm install
```

3. Update the `docusaurus.config.js` file with your GitHub username and repository name:

```javascript
// Edit these lines in docusaurus.config.js
url: 'https://yourusername.github.io',
baseUrl: '/payangel-api-docs/',
organizationName: 'yourusername', // Usually your GitHub org/user name.
projectName: 'payangel-api-docs', // Usually your repo name.
```

## Local Testing

Before deploying, test the site locally to ensure everything works as expected:

```bash
npm start
```

This will start a local development server and open up a browser window.

## Deploying to GitHub Pages

### Option 1: Using the deploy script

The easiest way to deploy is using the built-in deploy script:

```bash
GIT_USER=yourgithubusername npm run deploy
```

This command:
1. Builds your website
2. Creates a `gh-pages` branch if it doesn't exist
3. Pushes the built website to the `gh-pages` branch

### Option 2: Manual deployment

If you prefer to deploy manually:

1. Build the website:

```bash
npm run build
```

2. Push the `build` directory to the `gh-pages` branch:

```bash
git checkout -b gh-pages
git add -f build
git commit -m "Deploy website"
git push -u origin gh-pages
```

## Configure GitHub Pages

1. Go to your GitHub repository settings.
2. Scroll down to the "GitHub Pages" section.
3. Select the `gh-pages` branch as the source.
4. Click "Save".

After a few minutes, your site should be live at `https://yourusername.github.io/payangel-api-docs/`.

## Customizing the Documentation

To update or customize the documentation:

1. Edit the markdown files in the `docs/` directory.
2. For styling changes, modify the CSS files in `src/css/`.
3. For layout changes, edit the React components in `src/components/`.

After making changes:
1. Test locally using `npm start`.
2. When ready, deploy to GitHub Pages using the methods described above.

## Updating the Documentation

To update the documentation after initial deployment:

1. Make your changes to the relevant files.
2. Commit the changes to the main branch:

```bash
git add .
git commit -m "Update documentation"
git push origin main
```

3. Deploy to GitHub Pages again:

```bash
GIT_USER=yourgithubusername npm run deploy
```

## Troubleshooting

- If you encounter permission issues when deploying, make sure your GitHub token has the necessary permissions.
- If the site is not updating after deployment, check the GitHub Actions tab in your repository to see if there are any errors.
- Clear your browser cache if you don't see the latest changes after deployment.