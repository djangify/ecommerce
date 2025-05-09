import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    site: 'https://ecommerce.todiane.com',
    base: '/',
  },
});