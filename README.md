# PayAngel API Documentation

This repository contains the documentation for the PayAngel Disbursement API, built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The site is configured to be deployed to GitHub Pages. To deploy:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Project Structure

```
payangel-api-docs/
├── blog/
│   ├── (blog posts)
├── docs/
│   ├── api/
│   │   ├── introduction.md
│   │   ├── authentication.md
│   │   ├── disbursement/
│   │   │   ├── overview.md
│   │   │   └── ... (other disbursement endpoints)
│   │   ├── javascript/
│   │   │   └── examples.md
│   │   ├── typescript/
│   │   │   └── examples.md
│   │   ├── golang/
│   │   │   └── examples.md
│   │   └── java/
│   │       └── examples.md
├── src/
│   ├── components/
│   ├── css/
│   └── pages/
├── static/
│   └── img/
├── docusaurus.config.js
├── package.json
├── README.md
└── sidebars.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions about the API, please contact [developers@payangel.com](mailto:developers@payangel.com)