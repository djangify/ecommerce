// src/pages/api/cart/index.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, cookies }) => {

  try {
    // Forward to Django backend using the same pattern as the test
    const response = await fetch('http://localhost:8000/api/v1/cart/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        // Forward any set-cookie headers
        ...Object.fromEntries(Array.from(response.headers.entries())),
      },
    });

  } catch (error) {

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};