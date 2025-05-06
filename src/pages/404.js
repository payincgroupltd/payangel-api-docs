import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound() {
  return (
    <Layout
      title="Page Not Found"
      description="Page not found">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">Page Not Found</h1>
            <p>We could not find what you were looking for.</p>
            <p>
              Please check the URL or navigate back to the{' '}
              <Link to="/">homepage</Link> or{' '}
              <Link to="/docs/api/introduction">API documentation</Link>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}