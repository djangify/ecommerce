// Minimal middleware without cookie operations
import type { APIContext } from 'astro';

export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  // Simply pass through without any cookie operations
  return next();
}

