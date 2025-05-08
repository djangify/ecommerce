import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Call your backend API to create an order
    const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/api/v1/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        // Add any additional required fields
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const order = await response.json();

    return new Response(
      JSON.stringify({ orderId: order.id, orderNumber: order.order_number }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};