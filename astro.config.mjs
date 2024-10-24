import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from "@astrojs/node";

export default defineConfig({
  integrations: [tailwind(), mdx()],
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
});
