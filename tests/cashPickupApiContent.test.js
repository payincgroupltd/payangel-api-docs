const fs = require('fs');
const path = require('path');

describe('Cash Pickup API Documentation Content Tests', () => {
  test('Cash Pickup API overview contains required information', () => {
    const overviewPath = path.join(process.cwd(), 'docs/api/cash-pickup/overview.md');
    const content = fs.readFileSync(overviewPath, 'utf8');
    
    // Check for essential content in the overview
    expect(content).toContain('Base URL');
    expect(content).toContain('/business_apiV1.0/Cashpickup');
    expect(content).toContain('Authentication');
    expect(content).toContain('Claim Transaction');
    expect(content).toContain('Verify Beneficiary Identity');
    expect(content).toContain('Payout Beneficiary');
    expect(content).toContain('Abort Transaction');
  });

  test('Authentication documentation contains required fields', () => {
    const authPath = path.join(process.cwd(), 'docs/api/cash-pickup/authentication.md');
    const content = fs.readFileSync(authPath, 'utf8');
    
    // Check for essential elements in the authentication doc
    expect(content).toContain('/login');
    expect(content).toContain('Request');
    expect(content).toContain('agent_id');
    expect(content).toContain('agent_secret');
    expect(content).toContain('token');
  });

  test('Claim Transaction documentation contains required fields', () => {
    const claimPath = path.join(process.cwd(), 'docs/api/cash-pickup/claim-transaction.md');
    const content = fs.readFileSync(claimPath, 'utf8');
    
    // Check for essential elements in the claim transaction doc
    expect(content).toContain('/pullTransaction');
    expect(content).toContain('Request');
    expect(content).toContain('agent_id');
    expect(content).toContain('pccn');
    expect(content).toContain('trans_ref');
  });

  test('Verify Identity documentation contains required fields', () => {
    const verifyPath = path.join(process.cwd(), 'docs/api/cash-pickup/verify-identity.md');
    const content = fs.readFileSync(verifyPath, 'utf8');
    
    // Check for essential elements in the verify identity doc
    expect(content).toContain('/confirmBeneficiaryIdentity');
    expect(content).toContain('Request');
    expect(content).toContain('id_type');
    expect(content).toContain('id_number');
    expect(content).toContain('expiry_date');
    expect(content).toContain('failure_reason');
  });

  test('Payout Transaction documentation contains required fields', () => {
    const payoutPath = path.join(process.cwd(), 'docs/api/cash-pickup/payout.md');
    const content = fs.readFileSync(payoutPath, 'utf8');
    
    // Check for essential elements in the payout doc
    expect(content).toContain('/payoutTransaction');
    expect(content).toContain('Request');
    expect(content).toContain('agent_id');
    expect(content).toContain('trans_ref');
    expect(content).toContain('terminal_id');
    expect(content).toContain('branch_code');
  });

  test('Abort Transaction documentation contains required fields', () => {
    const abortPath = path.join(process.cwd(), 'docs/api/cash-pickup/abort.md');
    const content = fs.readFileSync(abortPath, 'utf8');
    
    // Check for essential elements in the abort doc
    expect(content).toContain('/abortTransaction');
    expect(content).toContain('Request');
    expect(content).toContain('agent_id');
    expect(content).toContain('trans_ref');
    expect(content).toContain('reason_type');
    expect(content).toContain('other_reason');
  });
});