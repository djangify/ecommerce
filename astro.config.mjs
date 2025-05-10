import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind()],
  server: {
    port: 3000,
    host: true
  },
  adapter: node({
    mode: 'standalone',
  }),
  build: {
    site: 'https://ecommerce.todiane.com',
    base: '/',
  },
});