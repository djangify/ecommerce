import type { APIRoute } from 'astro';
import { addToCart } from '../../../lib/api';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { productId, variantId, quantity } = data;

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