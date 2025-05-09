// src/pages/api/cart/add.ts
import type { APIRoute } from 'astro';
import { addToCart } from '../../../lib/api';

// Handle POST requests for adding items to cart
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { productId, variantId, quantity } = data;

    // Validate required fields
    if (!productId) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const result = await addToCart(productId, variantId, quantity);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Add GET handler to prevent routing errors
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: "Use POST method to add items to cart" }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Allow': 'POST'
    }
  });
};