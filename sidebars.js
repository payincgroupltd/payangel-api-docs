/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  apiSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['api/introduction', 'api/authentication'],
    },
    {
      type: 'category',
      label: 'Disbursement API',
      items: [
        'api/disbursement/overview',
        'api/disbursement/single-transaction',
        'api/disbursement/bulk-transaction',
        'api/disbursement/status',
      ],
    },
    {
      type: 'category',
      label: 'Code Samples',
      items: [
        'api/javascript/examples',
        'api/typescript/examples',
        'api/golang/examples',
        'api/java/examples',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'api/errors',
        'api/webhooks',
      ],
    },
  ],
};

export default sidebars;