/* ============================================ */
/* Configuration - config.js */
/* ============================================ */

window.CONFIG = {
  apiBaseUrl: 'https://corrison.corrisonapi.com/api/v1',
  cartStorageKey: 'ecommerce_cart',
  searchDelay: 300,
  maxRetries: 3,
  retryDelay: 1000
};

// API endpoints
window.API_ENDPOINTS = {
  products: '/products/',
  categories: '/categories/',
  cart: '/cart/',
  cartItems: '/items/',  // Fixed: was '/cart/items/' now '/items/'
  wishlist: '/wishlist/',
  pages: '/pages/',
  contact: '/contact/',
  contactSettings: '/contact-settings/',
  orders: '/orders/'
};

// UI constants
window.UI_CONSTANTS = {
  loadingTimeout: 10000,
  messageTimeout: 5000,
  animationDuration: 300
};