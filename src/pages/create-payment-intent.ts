import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const post: APIRoute = async ({ request }) => {
  try {
    const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const data = await request.json();
    const { amount, shipping_method } = data;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe requires integer amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        shipping_method: shipping_method
      }
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};