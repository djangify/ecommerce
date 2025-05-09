// src/pages/api/cart/update.ts
import type { APIRoute } from 'astro';
import { updateCartItem } from '../../../lib/api';

export const put: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { itemId, quantity } = data;

    if (!itemId || !quantity) {
      return new Response(JSON.stringify({ error: 'Item ID and quantity are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const result = await updateCartItem(itemId, quantity);

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
  return new Response(JSON.stringify({ error: "Use PUT method to update cart items" }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Allow': 'PUT'
    }
  });
};