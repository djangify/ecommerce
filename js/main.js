/* ============================================ */
/* Main Application - main.js */
/* ============================================ */

class App {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    console.log('Initializing Corrison Store App...');

    try {
      // Wait for all modules to be loaded
      await this.waitForModules();

      // Initialize components
      this.setupHTMX();
      await this.loadInitialData();
      this.setupEventListeners();
      this.initPageSpecificFeatures();

      this.initialized = true;
      console.log('App initialized successfully');

    } catch (error) {
      console.error('Failed to initialize app:', error);
      window.ui.showMessage('Failed to initialize store. Please refresh the page.', 'error');
    }
  }

  async waitForModules() {
    // Wait for all required modules to load
    const maxWaitTime = 5000; // 5 seconds
    const startTime = Date.now();

    while (!window.api || !window.ui || !window.cartManager || !window.productManager) {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error('Required modules failed to load');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  setupHTMX() {
    if (typeof htmx === 'undefined') return;

    // Configure HTMX defaults
    htmx.config.defaultSwapStyle = 'innerHTML';
    htmx.config.timeout = 10000;

    // Add CSRF token to all requests
    document.addEventListener('htmx:configRequest', (evt) => {
      const csrfToken = window.api.getCookie('csrftoken');
      if (csrfToken) {
        evt.detail.headers['X-CSRFToken'] = csrfToken;
      }
      evt.detail.headers['Content-Type'] = 'application/json';
    });

    // Handle loading states
    document.addEventListener('htmx:beforeRequest', (evt) => {
      window.ui.showLoading(evt.target);
    });

    document.addEventListener('htmx:afterRequest', (evt) => {
      window.ui.hideLoading(evt.target);
      if (evt.detail.xhr.status >= 400) {
        window.ui.showMessage('An error occurred. Please try again.', 'error');
      }
    });
  }

  async loadInitialData() {
    // Load categories first
    await window.productManager.loadCategories();

    // Load products for main page
    if (this.isMainPage()) {
      await window.productManager.loadProducts();
    }

    // Update cart count
    await window.cartManager.updateCartCount();
  }

  setupEventListeners() {
    // Setup search functionality
    window.productManager.setupSearch();

    // Setup filters
    window.productManager.setupFilters();

    // Setup global click handlers
    document.addEventListener('click', this.handleGlobalClick.bind(this));
  }

  handleGlobalClick(event) {
    // Handle add to cart buttons
    if (event.target.matches('.add-to-cart-btn') || event.target.closest('.add-to-cart-btn')) {
      event.preventDefault();
      const button = event.target.closest('.add-to-cart-btn');
      const productItem = button.closest('.product-item');
      if (productItem) {
        const productId = productItem.dataset.productId;
        if (productId) {
          window.cartManager.addToCart(productId, 1);
        }
      }
    }

    // Handle wishlist buttons
    if (event.target.matches('.wishlist-btn') || event.target.closest('.wishlist-btn')) {
      event.preventDefault();
      const button = event.target.closest('.wishlist-btn');
      const productItem = button.closest('.product-item');
      if (productItem) {
        const productId = productItem.dataset.productId;
        if (productId) {
          window.cartManager.toggleWishlist(productId);
        }
      }
    }
  }

  initPageSpecificFeatures() {
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case 'product':
        this.initProductPage();
        break;
      case 'cart':
        this.initCartPage();
        break;
      case 'checkout':
        this.initCheckoutPage();
        break;
      default:
        // Main shop page - already handled in loadInitialData
        break;
    }
  }

  initProductPage() {
    const productSlug = window.productManager.getProductSlugFromURL();
    if (productSlug) {
      window.productManager.loadProductDetail(productSlug);
    } else {
      // Redirect to shop if no product slug
      window.location.href = 'index.html';
    }
  }

  initCartPage() {
    // Cart page specific initialization
    console.log('Initializing cart page');
  }

  initCheckoutPage() {
    // Checkout page specific initialization
    console.log('Initializing checkout page');
  }

  getCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('product.html')) return 'product';
    if (path.includes('cart.html')) return 'cart';
    if (path.includes('checkout.html')) return 'checkout';

    return 'shop';
  }

  isMainPage() {
    return this.getCurrentPage() === 'shop';
  }
}

// Global functions for backward compatibility
window.addToCart = (productId, quantity = 1) => {
  window.cartManager.addToCart(productId, quantity);
};

window.toggleWishlist = (productId) => {
  window.cartManager.toggleWishlist(productId);
};

window.updateQuantity = (delta) => {
  window.productManager.updateQuantity(delta);
};

window.changeMainImage = (imageSrc) => {
  window.productManager.changeMainImage(imageSrc);
};

window.addToCartWithQuantity = () => {
  window.productManager.addToCartWithQuantity();
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});

// Initialize app if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  window.app = new App();
  window.app.init();
}
