import { defineConfig } from 'vite';

// LAN binding is opt-in for a trusted development network. The default is loopback.
export default defineConfig({
  server: { host: process.env.VITE_HOST ?? '127.0.0.1' },
  preview: { host: process.env.VITE_HOST ?? '127.0.0.1' },
  build: { outDir: 'dist' },
});
