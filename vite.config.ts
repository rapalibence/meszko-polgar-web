import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // render.html is a dev-only tool (scripts/render-frames.mjs); production builds only ship index.html.
  build: { rollupOptions: { input: command === 'build' ? 'index.html' : ['index.html', 'render.html'] } },
}));
