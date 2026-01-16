import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.budongsantrendreview.xyz',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
