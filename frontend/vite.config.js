import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert' // uncomment for production

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), /* mkcert() */], // add mkcert() for production
  server: {
    host: true,
    port: 5173,
    https: false // set true for production
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
