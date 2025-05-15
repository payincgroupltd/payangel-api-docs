const fs = require('fs');
const path = require('path');

describe('Documentation Structure Tests', () => {
  test('Required documentation files exist', () => {
    // Core documentation files
    const requiredFiles = [
      'docs/api/introduction.md',
      'docs/api/authentication.md',
      'docs/api/errors.md',
      'docs/api/webhooks.md',
      
      // Disbursement API files
      'docs/api/disbursement/overview.md',
      'docs/api/disbursement/single-transaction.md',
      'docs/api/disbursement/bulk-transaction.md',
      'docs/api/disbursement/status.md',
      
      // Collection API files
      'docs/api/collection/overview.md',
      'docs/api/collection/mobile-money.md',
      'docs/api/collection/card.md',
      'docs/api/collection/status.md',
      
      // Cash Pickup API files
      'docs/api/cash-pickup/overview.md',
      'docs/api/cash-pickup/authentication.md',
      'docs/api/cash-pickup/claim-transaction.md',
      'docs/api/cash-pickup/verify-identity.md',
      'docs/api/cash-pickup/payout.md',
      'docs/api/cash-pickup/abort.md',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  test('All documentation files have correct frontmatter', () => {
    // Get all markdown files in the docs directory
    const docsDir = path.join(process.cwd(), 'docs');
    
    function getAllMarkdownFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          getAllMarkdownFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
          fileList.push(filePath);
        }
      }
      
      return fileList;
    }
    
    const markdownFiles = getAllMarkdownFiles(docsDir);
    
    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check if file has frontmatter (starts with ---)
      expect(content.trim().startsWith('---')).toBe(true);
      
      // Check if frontmatter has required fields
      expect(content).toContain('id:');
      expect(content).toContain('title:');
    }
  });
});