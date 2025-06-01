/* ============================================ */
/* Cart Management - cart.js */
/* ============================================ */

class CartManager {
  constructor() {
    this.cartData = null;
    this.isLoading = false;
  }

  async addToCart(productId, quantity = 1, variantId = null) {
    if (this.isLoading) return;

    console.log('Adding to cart:', { productId, quantity, variantId });

    try {
      this.isLoading = true;
      window.ui.showLoading();

      // Convert to integer (no more UUIDs)
      const numericProductId = parseInt(productId);
      if (isNaN(numericProductId)) {
        throw new Error('Invalid product ID');
      }

      await window.api.addToCart(numericProductId, quantity, variantId);

      window.ui.showMessage('Product added to cart!', 'success');
      await this.updateCartCount();

    } catch (error) {
      console.error('Error adding to cart:', error);
      window.ui.showMessage(error.message || 'Failed to add product to cart', 'error');
    } finally {
      this.isLoading = false;
      window.ui.hideLoading();
    }
  }

  async updateCartCount() {
    try {
      const cart = await window.api.getCart();
      const itemCount = cart.total_items || 0;
      window.ui.updateCartCount(itemCount);
      this.cartData = cart;

      // Token is automatically handled by API client
      console.log('Cart updated:', {
        items: itemCount,
        hasDigital: cart.has_digital_items,
        hasPhysical: cart.has_physical_items,
        requiresShipping: cart.requires_shipping
      });

    } catch (error) {
      console.error('Error updating cart count:', error);

      // If token is invalid, clear it and retry once
      if (error.message.includes('401') || error.message.includes('403')) {
        console.log('Invalid cart token, clearing and retrying...');
        window.api.clearCartToken();

        try {
          const cart = await window.api.getCart();
          const itemCount = cart.total_items || 0;
          window.ui.updateCartCount(itemCount);
          this.cartData = cart;
        } catch (retryError) {
          console.error('Error on retry:', retryError);
          // Don't show error message for failed cart loads on first visit
        }
      }
    }
  }

  async toggleWishlist(productId) {
    console.log('Toggling wishlist for product:', productId);

    try {
      // Convert to integer
      const numericProductId = parseInt(productId);
      if (isNaN(numericProductId)) {
        throw new Error('Invalid product ID');
      }

      await window.api.addToWishlist(numericProductId);
      window.ui.showMessage('Added to wishlist!', 'success');
    } catch (error) {
      console.error('Error updating wishlist:', error);

      if (error.message.includes('401')) {
        window.ui.showMessage('Please log in to add items to your wishlist', 'info');
      } else {
        window.ui.showMessage('Failed to update wishlist', 'error');
      }
    }
  }

  async removeFromCart(itemId) {
    try {
      window.ui.showLoading();
      await window.api.removeFromCart(itemId);
      window.ui.showMessage('Item removed from cart', 'success');
      await this.updateCartCount();
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Don't show error message to user - some operations might fail silently
    } finally {
      window.ui.hideLoading();
    }
  }

  async updateCartItem(itemId, quantity) {
    try {
      await window.api.updateCartItem(itemId, parseInt(quantity));
      await this.updateCartCount();
    } catch (error) {
      console.error('Error updating cart item:', error);
      window.ui.showMessage('Failed to update quantity', 'error');
    }
  }

  async clearCart() {
    try {
      window.ui.showLoading();
      await window.api.clearCart();
      window.ui.showMessage('Cart cleared', 'success');
      await this.updateCartCount();
    } catch (error) {
      console.error('Error clearing cart:', error);
      window.ui.showMessage('Failed to clear cart', 'error');
    } finally {
      window.ui.hideLoading();
    }
  }

  // ============================================
  // CART PAGE SPECIFIC METHODS
  // ============================================

  async getCartData() {
    try {
      const cart = await window.api.getCart();
      this.cartData = cart;
      return cart;
    } catch (error) {
      console.error('Error getting cart data:', error);
      throw error;
    }
  }

  // Calculate cart totals for display
  calculateTotals(cartData) {
    const subtotal = parseFloat(cartData.subtotal || 0);

    // Free shipping logic - consider digital vs physical items
    let shipping = 0;
    if (cartData.requires_shipping && subtotal < 50) {
      shipping = 5.99;
    }

    const tax = subtotal * 0.1; // 10% tax rate
    const discount = 0; // No discount system implemented yet
    const total = subtotal + shipping + tax - discount;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping === 0 ? 'FREE' : shipping.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      itemCount: cartData.total_items || 0,
      isDigitalOnly: cartData.is_digital_only || false,
      requiresShipping: cartData.requires_shipping || false
    };
  }

  // Validate cart item before operations
  validateCartItem(itemId) {
    if (!this.cartData || !this.cartData.items) {
      throw new Error('Cart data not loaded');
    }

    const item = this.cartData.items.find(item => item.id === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    return item;
  }

  // Get product info from cart item
  getProductFromCartItem(itemId) {
    try {
      const item = this.validateCartItem(itemId);
      return item.product;
    } catch (error) {
      console.error('Error getting product from cart item:', error);
      return null;
    }
  }

  // Get cart token for checkout
  getCartToken() {
    return window.api.getCartToken();
  }
}

// Create global cart manager instance
window.cartManager = new CartManager();