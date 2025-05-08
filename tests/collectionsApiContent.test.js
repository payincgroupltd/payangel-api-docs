const fs = require('fs');
const path = require('path');

describe('Collections API Documentation Content Tests', () => {
  test('Collection API overview contains required information', () => {
    const overviewPath = path.join(process.cwd(), 'docs/api/collection/overview.md');
    const content = fs.readFileSync(overviewPath, 'utf8');
    
    // Check for essential content in the overview
    expect(content).toContain('Base URL');
    expect(content).toContain('/api/v1/middleware');
    expect(content).toContain('Mobile Money');
    expect(content).toContain('Card Collections');
  });

  test('Mobile Money documentation contains required fields', () => {
    const momoPath = path.join(process.cwd(), 'docs/api/collection/mobile-money.md');
    const content = fs.readFileSync(momoPath, 'utf8');
    
    // Check for essential elements in the mobile money doc
    expect(content).toContain('Request');
    expect(content).toContain('transactionId');
    expect(content).toContain('customerAccount');
    expect(content).toContain('transactionType');
    expect(content).toContain('Callback');
  });

  test('Card Collection documentation contains required fields', () => {
    const cardPath = path.join(process.cwd(), 'docs/api/collection/card.md');
    const content = fs.readFileSync(cardPath, 'utf8');
    
    // Check for essential elements in the card doc
    expect(content).toContain('Request');
    expect(content).toContain('transactionId');
    expect(content).toContain('transactionType');
    expect(content).toContain('card');
    expect(content).toContain('Callback');
  });

  test('Status endpoint documentation contains required information', () => {
    const statusPath = path.join(process.cwd(), 'docs/api/collection/status.md');
    const content = fs.readFileSync(statusPath, 'utf8');
    
    // Check for essential elements in the status doc
    expect(content).toContain('GET');
    expect(content).toContain('/status/');
    expect(content).toContain('COMPLETED');
    expect(content).toContain('PENDING');
    expect(content).toContain('FAILED');
  });
});