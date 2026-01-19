import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html',
      pages: 'build',
      assets: 'build',
      precompress: false,
      strict: false
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/soap-game' : '',
      relative: false
    },
    appDir: '_app'
  }
};


export default config;
