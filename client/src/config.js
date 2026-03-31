// API Configuration
// Change this URL based on your environment (development vs production)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yummy-kosher-grill.onrender.com';

export const ADMIN_API_BASE = `${API_BASE_URL}/api/admin`;
export const API_BASE = `${API_BASE_URL}/api`;

export default ADMIN_API_BASE;
