/* ============================================ */
/* UI Functions - ui.js */
/* ============================================ */

class UIManager {
  constructor() {
    this.loadingElements = new Set();
    this.messageContainer = null;
  }

  // Message display
  showMessage(message, type = 'info') {
    console.log('Showing message:', message, 'type:', type);

    // Remove existing messages
    const existingMessages = document.querySelectorAll('.toast-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `toast-message fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${this.getMessageClasses(type)}`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Auto-remove after timeout
    setTimeout(() => {
      messageDiv.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => messageDiv.remove(), 300);
    }, window.UI_CONSTANTS.messageTimeout);
  }

  getMessageClasses(type) {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  }

  // Loading states
  showLoading(element = null) {
    if (element) {
      element.classList.add('opacity-50', 'pointer-events-none');
      this.loadingElements.add(element);
    } else {
      document.body.style.cursor = 'wait';
    }
  }

  hideLoading(element = null) {
    if (element) {
      element.classList.remove('opacity-50', 'pointer-events-none');
      this.loadingElements.delete(element);
    } else {
      document.body.style.cursor = 'default';
    }
  }

  // Product display
  displayProducts(products) {
    console.log('Displaying', products.length, 'products');
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
      console.error('Product grid element not found');
      return;
    }

    if (products.length === 0) {
      this.displayNoProducts();
      return;
    }

    const productsHTML = products.map(product => this.createProductHTML(product)).join('');
    productGrid.innerHTML = productsHTML;
    console.log('Products displayed successfully');
  }

  displayNoProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-slate-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2m0 0a1 1 0 00-1-1H8a1 1 0 00-1 1m12 0v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 mb-2">No products found</h3>
        <p class="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
        <button onclick="window.productManager.loadProducts()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Retry Loading Products
        </button>
      </div>
    `;
  }

  createProductHTML(product) {
    // COMPLETELY REMOVED IMAGE LOADING - NO IMAGES AT ALL
    const salePrice = product.sale_price;
    const regularPrice = product.price;
    const isOnSale = salePrice && salePrice < regularPrice;

    return `
      <div class="group product-item" data-product-id="${product.id}" data-product-slug="${product.slug}">
        <div class="aspect-square bg-slate-100 rounded-lg mb-4 relative border-2 border-dashed border-slate-300">
          <!-- NO IMAGES - JUST PRODUCT INFO -->
          <div class="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <div class="text-slate-700 font-semibold mb-2">${product.name || 'Product'}</div>
            <div class="text-sm text-slate-500">${product.category?.name || 'Uncategorized'}</div>
            <div class="text-lg font-bold text-slate-900 mt-2">
              ${isOnSale ? `$${salePrice}` : `$${regularPrice}`}
            </div>
          </div>
          
          <div class="absolute top-3 right-3">
            <button 
              class="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 wishlist-btn"
              onclick="window.cartManager.toggleWishlist('${product.id}')"
              title="Add to Wishlist"
            >
              <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          ${isOnSale ? '<div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">SALE</div>' : ''}
        </div>
        
        <a href="product.html?slug=${product.slug}" class="block">
          <h3 class="font-medium text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">${product.name}</h3>
          <p class="text-sm text-slate-600 mb-2">${product.category?.name || 'Uncategorized'}</p>
          <div class="flex items-center gap-2">
            ${isOnSale ?
        `<p class="font-semibold text-red-600">$${salePrice}</p>
               <p class="text-sm text-slate-500 line-through">$${regularPrice}</p>` :
        `<p class="font-semibold text-slate-900">$${regularPrice}</p>`
      }
          </div>
        </a>
        
        <button 
          class="w-full mt-3 bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors add-to-cart-btn"
          onclick="window.cartManager.addToCart('${product.id}', 1)"
          ${!product.in_stock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
        >
          ${product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    `;
  }

  // Category display
  displayCategories(categories) {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) {
      console.warn('Category filter element not found');
      return;
    }

    // Keep the existing "All Categories" option
    const currentValue = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.slug;
      option.textContent = category.name;
      if (category.slug === currentValue) {
        option.selected = true;
      }
      categoryFilter.appendChild(option);
    });
  }

  // Cart count update
  updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';

      // Animate if count increased
      if (count > 0) {
        cartCount.classList.add('animate-bounce');
        setTimeout(() => cartCount.classList.remove('animate-bounce'), 500);
      }
    }
  }
}

// Create global UI manager instance
window.ui = new UIManager();