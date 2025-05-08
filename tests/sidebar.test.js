const fs = require('fs');
const path = require('path');

describe('Sidebar Configuration Tests', () => {
  test('Sidebar contains all required sections', () => {
    const sidebarPath = path.join(process.cwd(), 'sidebars.js');
    
    // Read the sidebar configuration
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    
    // Check for required sections
    expect(sidebarContent).toContain('Getting Started');
    expect(sidebarContent).toContain('Disbursement API');
    expect(sidebarContent).toContain('Collection API');
    expect(sidebarContent).toContain('Code Samples');
    expect(sidebarContent).toContain('Reference');
  });

  test('Collection API sidebar contains all required items', () => {
    const sidebarPath = path.join(process.cwd(), 'sidebars.js');
    
    // Read the sidebar configuration
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    
    // Check for Collection API items
    expect(sidebarContent).toContain('api/collection/overview');
    expect(sidebarContent).toContain('api/collection/mobile-money');
    expect(sidebarContent).toContain('api/collection/card');
    expect(sidebarContent).toContain('api/collection/status');
  });
});