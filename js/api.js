/* ============================================ */
/* API Functions - api.js */
/* ============================================ */

class APIClient {
  constructor() {
    this.baseUrl = window.CONFIG.apiBaseUrl;
    this.retryCount = 0;
    this.cartToken = this.getCartToken();
  }

  // Cart token management
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

    // Add cart token to headers if available
    if (this.cartToken) {
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
      } else if (data.cart_token) {
        this.setCartToken(data.cart_token);
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

  // Cart API methods
  async getCart() {
    const response = await this.makeRequest(window.API_ENDPOINTS.cart);

    // Store token if returned
    if (response.token) {
      this.setCartToken(response.token);
    }

    return response;
  }

  async addToCart(productSlugOrId, quantity = 1, variantId = null) {
    // If productSlugOrId is a string (slug), we need to get the product ID first
    let productId = productSlugOrId;

    // Check if it's a UUID (has dashes in UUID format) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productSlugOrId);

    if (!isUUID && typeof productSlugOrId === 'string') {
      console.log('Converting product slug to ID:', productSlugOrId);
      try {
        const product = await this.getProduct(productSlugOrId);
        productId = product.id;
        console.log('Product ID found:', productId);
      } catch (error) {
        console.error('Failed to get product by slug:', error);
        throw new Error('Product not found');
      }
    }

    const data = { product: productId, quantity };
    if (variantId) data.variant = variantId;

    console.log('Adding to cart with data:', data);

    const response = await this.makeRequest(window.API_ENDPOINTS.cartItems, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // Store token if returned
    if (response.cart_token) {
      this.setCartToken(response.cart_token);
    }

    return response;
  }

  async updateCartItem(itemId, quantity) {
    return await this.makeRequest(`${window.API_ENDPOINTS.cartItems}${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return await this.makeRequest(`${window.API_ENDPOINTS.cartItems}${itemId}/`, {
      method: 'DELETE'
    });
  }

  // Wishlist API methods
  async addToWishlist(productSlugOrId) {
    // If productSlugOrId is a string (slug), we need to get the product ID first
    let productId = productSlugOrId;

    if (typeof productSlugOrId === 'string') {
      try {
        const product = await this.getProduct(productSlugOrId);
        productId = product.id;
      } catch (error) {
        console.error('Failed to get product by slug for wishlist:', error);
        throw new Error('Product not found');
      }
    }

    return await this.makeRequest(window.API_ENDPOINTS.wishlist, {
      method: 'POST',
      body: JSON.stringify({ product: productId })
    });
  }
}

// Create global API client instance
window.api = new APIClient();