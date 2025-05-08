// src/lib/api.ts
import type { Product, Category, Cart, CartItem } from "../types";
const API = import.meta.env.PUBLIC_API_BASE_URL;

async function check<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) throw new Error(`Failed to fetch ${what}`);
  return res.json();
}

/** Products */
export function fetchProducts(): Promise<Product[]> {
  return fetch(`${API}/api/v1/products/`).then(r => check<Product[]>(r, "products"));
}
export function fetchProduct(slug: string): Promise<Product> {
  return fetch(`${API}/api/v1/products/${slug}/`).then(r => check<Product>(r, "product"));
}

/** Categories */
export function fetchCategories(): Promise<Category[]> {
  return fetch(`${API}/api/v1/categories/`).then(r => check<Category[]>(r, "categories"));
}
export function fetchCategory(slug: string): Promise<Category> {
  return fetch(`${API}/api/v1/categories/${slug}/`).then(r => check<Category>(r, "category"));
}

/** Cart */
export function fetchCart(): Promise<Cart> {
  return fetch(`${API}/api/v1/cart/`).then(r => check<Cart>(r, "cart"));
}
export function addToCart(productId: string, variantId?: string, quantity: number = 1): Promise<CartItem> {
  return fetch(`${API}/api/v1/cart/items/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product: productId,
      variant: variantId,
      quantity: quantity
    }),
  }).then(r => check<CartItem>(r, "cart item"));
}