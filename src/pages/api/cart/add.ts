import type { APIRoute } from 'astro';

const API = import.meta.env.VITE_PUBLIC_API_URL;

function forwardSetCookie(response: Response, headers: Headers) {
  const raw = (response.headers as any).raw()?.['set-cookie'] as string[] | undefined;
  if (!raw) return;
  raw.forEach(cookie => {
    const stripped = cookie.replace(/;\s*Domain=[^;]+/i, '');
    headers.append('Set-Cookie', stripped);
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const response = await fetch(`${API}/api/v1/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'application/json');
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
