/* ============================================ */
/* Product Management - products.js */
/* ============================================ */

class ProductManager {
  constructor() {
    this.currentFilters = {};
    this.isLoading = false;
    this.searchTimeout = null;
  }

  async loadProducts(filters = {}) {
    if (this.isLoading) return;

    console.log('Loading products with filters:', filters);


    try {
      this.isLoading = true;
      window.ui.showLoading();

      const data = await window.api.getProducts(filters);
      const products = data.results || data;

      // Debug: Check if products have IDs
      console.log('Products received:', products);
      if (products.length > 0) {
        console.log('First product structure:', products[0]);
        console.log('First product:', products[0]);
        console.log('Product ID field:', products[0].id);
        console.log('Product keys:', Object.keys(products[0]));
      }

      window.ui.displayProducts(products);
      this.currentFilters = filters;

    } catch (error) {
      console.error('Error loading products:', error);
      window.ui.showMessage(`Failed to load products: ${error.message}`, 'error');
      window.ui.displayNoProducts();
    } finally {
      this.isLoading = false;
      window.ui.hideLoading();
    }
  }

  async loadCategories() {
    try {
      const data = await window.api.getCategories();
      const categories = data.results || data;
      window.ui.displayCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProductDetail(productSlug) {
    console.log('Loading product detail for slug:', productSlug);

    try {
      window.ui.showLoading();
      const product = await window.api.getProduct(productSlug);
      this.updateProductDisplay(product);
    } catch (error) {
      console.error('Error loading product detail:', error);
      window.ui.showMessage('Product not found', 'error');
      // Redirect to shop if product not found
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } finally {
      window.ui.hideLoading();
    }
  }

  updateProductDisplay(product) {
    // Store the current product data for cart operations
    this.currentProduct = product;

    // Hide loading state and show product detail
    const loadingState = document.getElementById('loading-state');
    const productDetail = document.getElementById('product-detail');

    if (loadingState) loadingState.style.display = 'none';
    if (productDetail) productDetail.style.display = 'grid';

    // Update page title
    document.title = `${product.name} - Your Store Name`;

    // Update product name
    const productTitle = document.querySelector('h1');
    if (productTitle) {
      productTitle.textContent = product.name;
    }

    // Update price
    const priceContainer = document.querySelector('.text-3xl.font-bold');
    if (priceContainer && product.price) {
      const isOnSale = product.sale_price && product.sale_price < product.price;

      if (isOnSale) {
        priceContainer.innerHTML = `
          <span class="text-3xl font-bold text-red-600">$${product.sale_price}</span>
          <span class="text-xl text-slate-500 line-through ml-2">$${product.price}</span>
          <span class="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded ml-2">SALE</span>
        `;
      } else {
        priceContainer.textContent = `$${product.price}`;
      }
    }

    // Update description
    const descriptionElement = document.querySelector('p.text-slate-600.leading-relaxed');
    if (descriptionElement && product.description) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = product.description;
      descriptionElement.textContent = tempDiv.textContent || tempDiv.innerText || 'No description available';
    }

    // Update main image - use placeholder instead of loading images
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
      // Don't load actual images - use text placeholder
      mainImage.style.display = 'none';

      // Find or create main image placeholder
      let placeholder = document.querySelector('.main-image-placeholder');
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'main-image-placeholder w-full h-full flex flex-col items-center justify-center text-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg';
        placeholder.innerHTML = `
          <div class="text-slate-700 font-semibold text-lg mb-2">${product.name}</div>
          <div class="text-slate-500 text-sm">Main Product Image</div>
          <div class="text-slate-400 text-xs mt-2">Images temporarily disabled</div>
        `;
        mainImage.parentNode.insertBefore(placeholder, mainImage);
      }
    }

    // Update product images gallery
    if (product.images && product.images.length > 0) {
      this.updateImageGallery(product.images);
    }

    // Update product details
    const categoryElement = document.getElementById('product-category');
    if (categoryElement) {
      categoryElement.textContent = product.category?.name || 'Uncategorized';
    }

    const skuElement = document.getElementById('product-sku');
    if (skuElement) {
      skuElement.textContent = product.sku || 'N/A';
    }

    const stockElement = document.getElementById('product-stock');
    if (stockElement) {
      stockElement.textContent = product.in_stock ? 'In Stock' : 'Out of Stock';
      stockElement.className = product.in_stock ? 'text-sm text-green-600' : 'text-sm text-red-600';
    }

    // Enable buttons
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.disabled = !product.in_stock;
      addToCartBtn.textContent = product.in_stock ? 'Add to Cart' : 'Out of Stock';
      if (!product.in_stock) {
        addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }

    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.disabled = false;
    }

    // Update breadcrumb
    this.updateBreadcrumb(product.category?.name || 'Products', product.name);

    // Show related products section
    const relatedSection = document.getElementById('related-products');
    if (relatedSection) {
      relatedSection.style.display = 'block';
    }
  }

  updateImageGallery(images) {
    const thumbnailContainer = document.querySelector('.grid.grid-cols-4.gap-4');
    if (!thumbnailContainer) return;

    // Create text-based placeholder thumbnails - NO IMAGES
    const thumbnailCount = Math.min(images.length || 4, 4); // Max 4 thumbnails
    thumbnailContainer.innerHTML = Array.from({ length: thumbnailCount }, (_, index) => `
      <button class="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 ${index === 0 ? 'border-teal-600' : 'hover:border-slate-400'}" onclick="window.productManager.selectThumbnail(${index})">
        <div class="w-full h-full flex flex-col items-center justify-center text-center p-2">
          <div class="text-slate-600 text-xs font-medium">Image ${index + 1}</div>
          <div class="text-slate-400 text-xs mt-1">Thumbnail</div>
        </div>
      </button>
    `).join('');
  }

  updateBreadcrumb(categoryName, productName) {
    const breadcrumb = document.querySelector('nav[aria-label="Breadcrumb"] ol');
    if (!breadcrumb) return;

    breadcrumb.innerHTML = `
      <li class="inline-flex items-center">
        <a href="index.html" class="text-slate-600 hover:text-teal-600">Shop</a>
      </li>
      <li>
        <div class="flex items-center">
          <svg class="w-4 h-4 text-slate-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <a href="index.html?category=${categoryName}" class="text-slate-600 hover:text-teal-600">${categoryName}</a>
        </div>
      </li>
      <li>
        <div class="flex items-center">
          <svg class="w-4 h-4 text-slate-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-slate-500">${productName}</span>
        </div>
      </li>
    `;
  }

  setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
          this.loadProducts({ search: query });
        } else if (query.length === 0) {
          this.loadProducts();
        }
      }, window.CONFIG.searchDelay);
    });
  }

  setupFilters() {
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        const filters = this.getActiveFilters();
        this.loadProducts(filters);
      });
    }

    // Price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        const filters = this.getActiveFilters();
        this.loadProducts(filters);
      });
    }

    // Sort filter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        const filters = this.getActiveFilters();
        this.loadProducts(filters);
      });
    }
  }

  // In products.js, in the getActiveFilters() function, update the sort filter section
  getActiveFilters() {
    const filters = {};

    // Get category from dropdown if it exists
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value) {
      filters.category = categoryFilter.value;
    }

    // Price filter - backend expects min_price and max_price
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter && priceFilter.value) {
      const priceRange = priceFilter.value;
      if (priceRange === 'under25') {
        filters.max_price = 25;
      } else if (priceRange === '25-50') {
        filters.min_price = 25;
        filters.max_price = 50;
      } else if (priceRange === '50-100') {
        filters.min_price = 50;
        filters.max_price = 100;
      } else if (priceRange === 'over100') {
        filters.min_price = 100;
      }
    }

    // Sort filter - DRF expects 'ordering' parameter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter && sortFilter.value) {
      // Map frontend sort values to backend ordering values
      const sortMap = {
        'price_low': 'effective_price',
        'price_high': '-effective_price',
        'newest': '-created_at',
        'name': 'name'
      };
      filters.ordering = sortMap[sortFilter.value] || sortFilter.value;
    }

    // Search query
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
      filters.search = searchInput.value.trim();
    }

    console.log('Active filters being sent:', filters);
    return filters;
  }
  // Product detail page specific methods
  selectThumbnail(index) {
    // Update thumbnail selection without loading images
    document.querySelectorAll('.grid.grid-cols-4.gap-4 button').forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.remove('border-transparent', 'border-slate-300');
        thumb.classList.add('border-teal-600');
      } else {
        thumb.classList.remove('border-teal-600');
        thumb.classList.add('border-transparent');
      }
    });
  }

  changeMainImage(imageSrc) {
    // Keep this method for backward compatibility but don't load images
    console.log('Image switching disabled - using placeholder');
  }

  updateQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value) || 1;
      const newValue = Math.max(1, currentValue + delta);
      quantityInput.value = newValue;
    }
  }

  addToCartWithQuantity() {
    const quantity = document.getElementById('quantity')?.value || 1;

    // Use the stored product data to get the correct product ID
    if (this.currentProduct && this.currentProduct.id) {
      window.cartManager.addToCart(this.currentProduct.id, parseInt(quantity));
    } else {
      console.error('No product data available for cart operation');
      window.ui.showMessage('Unable to add to cart. Please refresh the page.', 'error');
    }
  }

  getProductSlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
  }

  // Keep the old method name for backward compatibility
  getProductIdFromURL() {
    return this.getProductSlugFromURL();
  }
}

// Create global product manager instance
window.productManager = new ProductManager();