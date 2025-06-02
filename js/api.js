/* ============================================ */
/* API Functions - api.js */
/* ============================================ */

class APIClient {
  constructor() {
    this.baseUrl = window.CONFIG.apiBaseUrl;
    this.retryCount = 0;
    this.cartToken = this.getCartToken();
  }

  // Cart token management (JWT tokens)
  getCartToken() {
    return localStorage.getItem('cart_token');
  }

  setCartToken(token) {
    localStorage.setItem('cart_token', token);
    this.cartToken = token;
  }

  clearCartToken() {
    localStorage.removeItem('cart_token');
    this.cartToken = null;
  }

  async makeRequest(url, options = {}) {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    // Add cart token to headers if available (for cart operations)
    if (this.cartToken && (url.includes('/cart') || url.includes('/items/'))) {
      defaultOptions.headers['Authorization'] = `Bearer ${this.cartToken}`;
    }

    const csrfToken = this.getCookie('csrftoken');
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      defaultOptions.headers['X-CSRFToken'] = csrfToken;
    }

    const finalOptions = { ...defaultOptions, ...options };
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

    console.log(`API Request: ${finalOptions.method || 'GET'} ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, finalOptions);
      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update cart token if present in response
      if (data.token) {
        this.setCartToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Product API methods
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${window.API_ENDPOINTS.products}?${queryParams}`;
    return await this.makeRequest(url);
  }

  async getProduct(productSlug) {
    return await this.makeRequest(`${window.API_ENDPOINTS.products}${productSlug}/`);
  }

  async getCategories() {
    return await this.makeRequest(window.API_ENDPOINTS.categories);
  }

  // Cart API methods (JWT token based)
  async getCart() {
    const response = await this.makeRequest(window.API_ENDPOINTS.cart);

    // Store token if returned
    if (response.token) {
      this.setCartToken(response.token);
    }

    return response;
  }

  async addToCart(productId, quantity = 1, variantId = null) {
    // Convert productId to integer if it's a string
    const numericProductId = parseInt(productId);

    if (isNaN(numericProductId)) {
      throw new Error('Invalid product ID');
    }

    console.log('Adding to cart:', { productId: numericProductId, quantity, variantId });

    const data = { product: numericProductId, quantity };
    if (variantId) {
      data.variant = parseInt(variantId);
    }

    const response = await this.makeRequest(window.API_ENDPOINTS.cartItems, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // Store token if returned
    if (response.token) {
      this.setCartToken(response.token);
    }

    return response;
  }

  async updateCartItem(itemId, quantity) {
    return await this.makeRequest(`${window.API_ENDPOINTS.cartItems}${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: parseInt(quantity) })
    });
  }

  async removeFromCart(itemId) {
    return await this.makeRequest(`${window.API_ENDPOINTS.cartItems}${itemId}/`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return await this.makeRequest(`${window.API_ENDPOINTS.cart}clear/`, {
      method: 'POST'
    });
  }

  // Wishlist API methods
  async addToWishlist(productId) {
    // Convert productId to integer
    const numericProductId = parseInt(productId);

    if (isNaN(numericProductId)) {
      throw new Error('Invalid product ID');
    }

    return await this.makeRequest(window.API_ENDPOINTS.wishlist, {
      method: 'POST',
      body: JSON.stringify({ product: numericProductId })
    });
  }
}

// Create global API client instance
window.api = new APIClient();