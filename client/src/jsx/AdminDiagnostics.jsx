import React, { useState } from 'react';
import { ADMIN_API_BASE } from '../config.js';

export default function AdminDiagnostics() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = ADMIN_API_BASE;
  const SERVER_BASE = API_BASE.substring(0, API_BASE.lastIndexOf('/api')); // Remove /api to get server base


  const addResult = (test, status, message, details = '') => {
    setResults(prev => [...prev, { test, status, message, details, time: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setResults([]);
    setLoading(true);

    try {
      // Test 1: Server Health
      addResult('Server Connection', 'testing', 'Testing if server is running...');
      try {
        const healthResponse = await fetch(`${SERVER_BASE}/api/health`, { method: 'GET' });
        if (healthResponse.ok) {
          addResult('Server Connection', 'success', 'Server is running ✓');
        } else {
          addResult('Server Connection', 'warning', `Server responded with status ${healthResponse.status}`);
        }
      } catch (e) {
        addResult('Server Connection', 'error', 'Cannot connect to server', e.message);
      }

      // Test 2: Get Menu Status
      addResult('Get Menu Status', 'testing', 'Fetching menu status...');
      try {
        const response = await fetch(`${API_BASE}/menu-status`);
        const data = await response.json();
        if (response.ok) {
          addResult('Get Menu Status', 'success', `Menu is ${data.isOpen ? 'OPEN' : 'CLOSED'} ✓`, JSON.stringify(data));
        } else {
          addResult('Get Menu Status', 'error', `Error: ${data.error}`, data.details);
        }
      } catch (e) {
        addResult('Get Menu Status', 'error', 'Failed to fetch menu status', e.message);
      }

      // Test 3: Get Menu Items
      addResult('Get Menu Items', 'testing', 'Fetching menu items...');
      try {
        const response = await fetch(`${API_BASE}/menu-items`);
        const data = await response.json();
        if (response.ok) {
          let totalItems = 0;
          data.forEach(cat => totalItems += cat.items.length);
          addResult('Get Menu Items', 'success', `Retrieved ${data.length} categories with ${totalItems} total items ✓`, `First category: ${data[0].category} with ${data[0].items.length} items`);
        } else {
          addResult('Get Menu Items', 'error', `Error: ${data.error}`, data.details);
        }
      } catch (e) {
        addResult('Get Menu Items', 'error', 'Failed to fetch menu items', e.message);
      }

      // Test 4: Toggle Menu Status
      addResult('Toggle Menu Status', 'testing', 'Testing PUT /menu-status endpoint...');
      try {
        const currentStatus = await fetch(`${API_BASE}/menu-status`).then(r => r.json());
        const newStatus = !currentStatus.isOpen;
        
        const response = await fetch(`${API_BASE}/menu-status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isOpen: newStatus })
        });
        const data = await response.json();
        
        if (response.status === 200) {
          // Toggle back to original
          await fetch(`${API_BASE}/menu-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isOpen: currentStatus.isOpen })
          });
          addResult('Toggle Menu Status', 'success', 'Successfully toggled menu status (toggled back) ✓', JSON.stringify(data));
        } else {
          addResult('Toggle Menu Status', 'error', `Error: ${data.error}`, data.details);
        }
      } catch (e) {
        addResult('Toggle Menu Status', 'error', 'Failed to toggle menu status', e.message);
      }

      // Test 5: Toggle Item Stock
      addResult('Toggle Item Stock', 'testing', 'Testing PUT /menu-items/:id endpoint...');
      try {
        const menuResponse = await fetch(`${API_BASE}/menu-items`);
        const menu = await menuResponse.json();
        const testItem = menu[0].items[0];
        
        const response = await fetch(`${API_BASE}/menu-items/${testItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outOfStock: !testItem.outOfStock })
        });
        const data = await response.json();
        
        if (response.status === 200) {
          // Toggle back to original
          await fetch(`${API_BASE}/menu-items/${testItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ outOfStock: testItem.outOfStock })
          });
          addResult('Toggle Item Stock', 'success', `Successfully toggled item "${testItem.item}" (toggled back) ✓`, JSON.stringify(data));
        } else {
          addResult('Toggle Item Stock', 'error', `Error: ${data.error}`, data.details);
        }
      } catch (e) {
        addResult('Toggle Item Stock', 'error', 'Failed to toggle item stock', e.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin API Diagnostics</h1>
      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {results.map((result, idx) => (
          <div 
            key={idx}
            style={{
              marginBottom: '10px',
              padding: '15px',
              borderRadius: '8px',
              background: result.status === 'success' ? '#e8f5e9' : result.status === 'error' ? '#ffebee' : '#fff3e0',
              borderLeft: `4px solid ${result.status === 'success' ? '#4caf50' : result.status === 'error' ? '#f44336' : '#ff9800'}`,
              fontFamily: 'monospace'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {result.test} - {result.status.toUpperCase()} [{result.time}]
            </div>
            <div>{result.message}</div>
            {result.details && <div style={{ marginTop: '5px', opacity: 0.7, fontSize: '12px' }}>{result.details}</div>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>How to use this diagnostic:</h3>
        <ol>
          <li>Click "Run Diagnostic Tests" button above</li>
          <li>Wait for all tests to complete</li>
          <li>Check the results for any errors</li>
          <li>Share the results with the support team if needed</li>
        </ol>
        
        <h3>What each test does:</h3>
        <ul>
          <li><strong>Server Connection</strong> - Checks if Node.js server is running</li>
          <li><strong>Get Menu Status</strong> - Tests reading menu open/closed status</li>
          <li><strong>Get Menu Items</strong> - Tests fetching all menu items</li>
          <li><strong>Toggle Menu Status</strong> - Tests updating menu status (toggles it back)</li>
          <li><strong>Toggle Item Stock</strong> - Tests updating individual item stock (toggles it back)</li>
        </ul>
      </div>
    </div>
  );
}
