import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config.js';
import '../css/Admin.css';

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password check
  const ADMIN_PASSWORD = '770Rebbe770!'; // TODO: Change this to a secure method

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setSaveMessage('');
      setPassword('');
    } else {
      setSaveMessage('Invalid password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuStatus();
      fetchMenuItems();
    }
  }, [isAuthenticated]);

  const fetchMenuStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-status`);
      if (response.ok) {
        const data = await response.json();
        setMenuOpen(data.isOpen);
      } else {
        console.error('Failed to fetch menu status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching menu status:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/menu-items`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched menu items:', data);
        setMenuItems(data);
      } else {
        console.error('Failed to fetch menu items:', response.status);
        setSaveMessage('Failed to load menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setSaveMessage('Failed to load menu items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenuStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOpen: !menuOpen }),
      });

      const data = await response.json();
      console.log('Menu status response:', response.status, 'Data:', data);

      if (response.status === 200 || response.ok) {
        setMenuOpen(!menuOpen);
        setSaveMessage(`Menu is now ${!menuOpen ? 'OPEN' : 'CLOSED'}`);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error: ' + (data.error || 'Failed to update menu status'));
      }
    } catch (error) {
      console.error('Error updating menu status:', error);
      setSaveMessage('Error updating menu status: ' + error.message);
    }
  };

  const toggleOutOfStock = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outOfStock: !currentStatus }),
      });

      const data = await response.json();
      console.log('Response status:', response.status, 'Data:', data);

      if (response.status === 200 || response.ok) {
        // Update local state
        setMenuItems((prevItems) =>
          prevItems.map((category) => ({
            ...category,
            items: category.items.map((item) =>
              item.id === itemId ? { ...item, outOfStock: !currentStatus } : item
            ),
          }))
        );
        setSaveMessage('Item updated successfully');
        setTimeout(() => setSaveMessage(''), 2000);
      } else {
        setSaveMessage('Error: ' + (data.error || 'Failed to update item'));
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setSaveMessage('Error updating item: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-box">
          <h1>Admin Dashboard</h1>
          <p>Enter password to access the admin panel</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
          {saveMessage && <p className="error-message">{saveMessage}</p>}
        </div>
      </div>
    );
  }

  const filteredMenuItems = menuItems
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Restaurant Admin Dashboard</h1>
        <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>
          Logout
        </button>
      </div>

      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
          {saveMessage}
        </div>
      )}

      {/* Menu Status Section */}
      <div className="admin-section menu-status-section">
        <h2>Menu Status</h2>
        <div className="status-card">
          <div className="status-display">
            <p>Current Status:</p>
            <span className={`status-badge ${menuOpen ? 'open' : 'closed'}`}>
              {menuOpen ? '🟢 OPEN' : '🔴 CLOSED'}
            </span>
          </div>
          <button 
            className={`toggle-btn ${menuOpen ? 'close-menu' : 'open-menu'}`}
            onClick={toggleMenuStatus}
          >
            {menuOpen ? 'Close Menu' : 'Open Menu'}
          </button>
        </div>
      </div>

      {/* Items Management Section */}
      <div className="admin-section items-section">
        <h2>Manage Items Stock</h2>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="loading">Loading menu items...</p>
        ) : filteredMenuItems.length === 0 ? (
          <p className="no-items">No items found</p>
        ) : (
          <div className="categories-list">
            {filteredMenuItems.map((category) => (
              <div key={category.category} className="category-section">
                <h3 className="category-title">{category.category}</h3>
                <div className="items-grid">
                  {category.items.map((item) => (
                    <div key={item.id} className={`item-card ${item.outOfStock ? 'out-of-stock' : ''}`}>
                      <div className="item-header">
                        <div className="item-info">
                          <h4>{item.item}</h4>
                          <p className="item-price">{item.price}</p>
                        </div>
                        <span className={`stock-indicator ${item.outOfStock ? 'out' : 'in'}`}>
                          {item.outOfStock ? '❌ Out' : '✅ In'}
                        </span>
                      </div>
                      <button
                        className={`stock-toggle-btn ${item.outOfStock ? 'mark-available' : 'mark-unavailable'}`}
                        onClick={() => toggleOutOfStock(item.id, item.outOfStock)}
                      >
                        {item.outOfStock ? 'Mark as Available' : 'Mark as Out of Stock'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
