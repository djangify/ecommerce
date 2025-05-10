import type { Product, Category, Cart, CartItem } from "../types";

// Hardcode the API URL for local development
const API = 'http://localhost:8000';

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

/** Products */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API}/api/v1/products/`);

    if (!response.ok) {
      console.warn(`Products fetch failed with status: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(slug: string): Promise<Product> {
  try {
    return fetch(`${API}/api/v1/products/${slug}/`)
      .then(r => check<Product>(r, "product"));
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    throw error;
  }
}

/** Categories */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API}/api/v1/categories/`);

    if (!response.ok) {
      console.warn(`Categories fetch failed with status: ${response.status}`);
      // Return an empty categories array instead of throwing an error
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array on error
    return [];
  }
}

/** Cart */
export async function fetchCart(): Promise<Cart> {
  try {
    const response = await fetch(`${API}/api/v1/cart/`, {
      credentials: 'include', // Include cookies for session-based carts
    });

    if (!response.ok) {
      console.warn(`Cart fetch failed with status: ${response.status}`);
      // Return an empty cart instead of throwing an error
      return {
        id: "temp-cart",
        items: [],
        subtotal: 0,
        total_items: 0,
        created_at: new Date().toISOString()
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty cart on error for graceful degradation
    return {
      id: "temp-cart",
      items: [],
      subtotal: 0,
      total_items: 0,
      created_at: new Date().toISOString()
    };
  }
}

export async function addToCart(productId: string, variantId?: string, quantity: number = 1): Promise<CartItem> {
  try {
    return fetch(`${API}/api/v1/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        product: productId,  // Keep as is, this is correct
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
  try {
    return fetch(`${API}/api/v1/cart/items/${itemId}/`, {
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
  try {
    return fetch(`${API}/api/v1/cart/items/${itemId}/`, {
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