import type { APIRoute } from 'astro';

const API = import.meta.env.VITE_PUBLIC_API_URL;

function forwardSetCookie(response: Response, headers: Headers) {
  // grab raw Set-Cookie headers out of the Fetch API
  const raw = (response.headers as any).raw()?.['set-cookie'] as string[] | undefined;
  if (!raw) return;
  raw.forEach(cookie => {
    // strip off any Domain=...; so it defaults to THIS host
    const stripped = cookie.replace(/;\s*Domain=[^;]+/i, '');
    headers.append('Set-Cookie', stripped);
  });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const response = await fetch(`${API}/api/v1/cart/`, {
      method: 'GET',
      headers: { 'Cookie': request.headers.get('cookie') ?? '' },
    });
    const data = await response.json();

    // start with all headers from Django (including any Set-Cookie)
    const headers = new Headers(response.headers);
    // ensure JSON
    headers.set('Content-Type', 'application/json');
    // strip Domain=... so cookies become host-only
    forwardSetCookie(response, headers);

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers }
    );
  }
};
