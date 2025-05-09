// src/pages/api/cart/remove.ts
import type { APIRoute } from 'astro';
import { removeCartItem } from '../../../lib/api';

export const del: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { itemId } = data;

    if (!itemId) {
      return new Response(JSON.stringify({ error: 'Item ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    await removeCartItem(itemId);

    return new Response(JSON.stringify({ success: true }), {
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
export const get: APIRoute = async () => {
  return new Response(JSON.stringify({ error: "Use DELETE method to remove cart items" }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Allow': 'DELETE'
    }
  });
};