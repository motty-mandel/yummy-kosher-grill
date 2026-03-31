import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const menuStatusFile = path.join(__dirname, '../data/menu-status.json');
const menuFile = path.join(__dirname, '../../client/src/menus/menu.json');

// Ensure menu-status.json exists
if (!fs.existsSync(menuStatusFile)) {
  fs.writeFileSync(menuStatusFile, JSON.stringify({ isOpen: true, lastUpdated: new Date().toISOString() }, null, 2));
}

// Get menu status (open/close)
router.get('/menu-status', (req, res) => {
  try {
    const data = fs.readFileSync(menuStatusFile, 'utf-8');
    const status = JSON.parse(data);
    console.log('Menu status retrieved:', status);
    res.json(status);
  } catch (error) {
    console.error('Error retrieving menu status:', error);
    res.status(500).json({ error: 'Failed to retrieve menu status' });
  }
});

// Update menu status (open/close)
router.put('/menu-status', (req, res) => {
  try {
    const { isOpen } = req.body;
    console.log(`Updating menu status to isOpen: ${isOpen}`);
    const status = {
      isOpen,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(menuStatusFile, JSON.stringify(status, null, 2));
    console.log('Menu status updated successfully');
    res.json(status);
  } catch (error) {
    console.error('Error updating menu status:', error);
    res.status(500).json({ error: 'Failed to update menu status', details: error.message });
  }
});

// Get all menu items with stock status
router.get('/menu-items', (req, res) => {
  try {
    const data = fs.readFileSync(menuFile, 'utf-8');
    const menu = JSON.parse(data);
    console.log('Menu items retrieved, total categories:', menu.length);
    res.json(menu);
  } catch (error) {
    console.error('Error retrieving menu items:', error);
    res.status(500).json({ error: 'Failed to retrieve menu items', details: error.message });
  }
});

// Update item stock status
router.put('/menu-items/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const { outOfStock } = req.body;

    console.log(`Updating item ${itemId} to outOfStock: ${outOfStock}`);

    // Read current menu
    const data = fs.readFileSync(menuFile, 'utf-8');
    const menu = JSON.parse(data);

    // Find and update the item
    let itemFound = false;
    for (let category of menu) {
      for (let item of category.items) {
        if (item.id === itemId) {
          console.log(`Found item: ${item.item}, updating from ${item.outOfStock} to ${outOfStock}`);
          item.outOfStock = outOfStock;
          itemFound = true;
          break;
        }
      }
      if (itemFound) break;
    }

    if (!itemFound) {
      console.log(`Item ${itemId} not found`);
      return res.status(404).json({ error: 'Item not found' });
    }

    // Write updated menu back
    fs.writeFileSync(menuFile, JSON.stringify(menu, null, 2));
    console.log(`Successfully updated menu and saved to ${menuFile}`);
    res.json({ success: true, message: 'Item stock status updated' });
  } catch (error) {
    console.error('Error updating item stock status:', error);
    res.status(500).json({ error: 'Failed to update item stock status', details: error.message });
  }
});

// Bulk update multiple items stock status
router.put('/menu-items-bulk', (req, res) => {
  try {
    const { updates } = req.body; // Array of { itemId, outOfStock }

    // Read current menu
    const data = fs.readFileSync(menuFile, 'utf-8');
    const menu = JSON.parse(data);

    // Create a map for quick lookup
    const updateMap = new Map(updates.map(u => [u.itemId, u.outOfStock]));

    // Update items
    for (let category of menu) {
      for (let item of category.items) {
        if (updateMap.has(item.id)) {
          item.outOfStock = updateMap.get(item.id);
        }
      }
    }

    // Write updated menu back
    fs.writeFileSync(menuFile, JSON.stringify(menu, null, 2));
    res.json({ success: true, message: 'Items updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update items' });
  }
});

export default router;
