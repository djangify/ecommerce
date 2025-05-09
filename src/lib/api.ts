// src/lib/api.ts - Updated implementation with TypeScript fixes
import type { Product, Category, Cart, CartItem } from "../types";

// Default base URL - adjust this to point to your Django backend
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Helper function to check API responses
 */
async function check<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error (${res.status}): ${errorText}`);
    throw new Error(`Failed to fetch ${what}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Mock data for development when API is not available
 */
const MOCK_MODE = true; // Set to true during development if API is unavailable

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sample Product',
    slug: 'sample-product',
    description: 'This is a sample product description.',
    price: 29.99,
    sale_price: null,
    current_price: 29.99,
    is_on_sale: false,
    is_featured: true,
    in_stock: true,
    stock_qty: 10,
    sku: 'PROD001',
    main_image: '/api/placeholder/400/320',
    images: [],
    variants: [],
    category: {
      id: '1',
      name: 'Sample Category',
      slug: 'sample-category',
      description: 'Sample category description',
      image: null
    }
  }
];

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Sample Category',
    slug: 'sample-category',
    description: 'Sample category description',
    image: null
  }
];

const MOCK_CART: Cart = {
  id: '1',
  items: [{
    id: '1',
    product: MOCK_PRODUCTS[0],
    variant: null,
    quantity: 1,
    unit_price: 29.99,
    total_price: 29.99
  }],
  subtotal: 29.99,
  total_items: 1,
  created_at: new Date().toISOString()
};

/** Products */
export async function fetchProducts(): Promise<Product[]> {
  if (MOCK_MODE) return MOCK_PRODUCTS;

  try {
    return fetch(`${API_BASE}/api/v1/products/`)
      .then(r => check<Product[]>(r, "products"));
  } catch (error) {
    console.error('Error fetching products:', error);
    return MOCK_PRODUCTS;
  }
}

export async function fetchProduct(slug: string): Promise<Product> {
  if (MOCK_MODE) return MOCK_PRODUCTS[0];

  try {
    return fetch(`${API_BASE}/api/v1/products/${slug}/`)
      .then(r => check<Product>(r, "product"));
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return MOCK_PRODUCTS[0];
  }
}

/** Categories */
export async function fetchCategories(): Promise<Category[]> {
  if (MOCK_MODE) return MOCK_CATEGORIES;

  try {
    return fetch(`${API_BASE}/api/v1/categories/`)
      .then(r => check<Category[]>(r, "categories"));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return MOCK_CATEGORIES;
  }
}

export async function fetchCategory(slug: string): Promise<Category> {
  if (MOCK_MODE) return MOCK_CATEGORIES[0];

  try {
    return fetch(`${API_BASE}/api/v1/categories/${slug}/`)
      .then(r => check<Category>(r, "category"));
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return MOCK_CATEGORIES[0];
  }
}

/** Cart */
export async function fetchCart(): Promise<Cart> {
  if (MOCK_MODE) return MOCK_CART;

  try {
    return fetch(`${API_BASE}/api/v1/cart/`, {
      credentials: 'include', // Include cookies for session-based carts
    }).then(r => check<Cart>(r, "cart"));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return MOCK_CART;
  }
}

export async function addToCart(productId: string, variantId?: string, quantity: number = 1): Promise<CartItem> {
  if (MOCK_MODE) return MOCK_CART.items[0];

  try {
    return fetch(`${API_BASE}/api/v1/cart/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session-based carts
      body: JSON.stringify({
        product: productId,
        variant: variantId,
        quantity: quantity
      }),
    }).then(r => check<CartItem>(r, "cart item"));
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  if (MOCK_MODE) return MOCK_CART.items[0];

  try {
    return fetch(`${API_BASE}/api/v1/cart/items/${itemId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        quantity: quantity
      }),
    }).then(r => check<CartItem>(r, "updated cart item"));
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export async function removeCartItem(itemId: string): Promise<void> {
  if (MOCK_MODE) return;

  try {
    return fetch(`${API_BASE}/api/v1/cart/items/${itemId}/`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(r => {
      if (!r.ok) {
        throw new Error(`Failed to remove item: ${r.statusText}`);
      }
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
}