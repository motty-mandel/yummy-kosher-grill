// API Configuration
// Change this URL based on your environment (development vs production)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yummy-kosher-grill.onrender.com';

export const ADMIN_API_BASE = `https://yummy-kosher-grill.onrender.com/api/admin`;
export const API_BASE = `https://yummy-kosher-grill.onrender.com/api`;

export default ADMIN_API_BASE;