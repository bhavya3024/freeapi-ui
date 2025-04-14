import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Match the specific path prefix
      '/api/v1/public/randomusers': {
        target: 'https://api.freeapi.app/api/v1/public/randomusers', // Target the full endpoint base
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        // Rewrite to remove the matched prefix, leaving only query params (or empty string if no query)
        rewrite: (path) => path.replace(/^\/api\/v1\/public\/randomusers/, ''), 
      },
      // You could potentially add other specific proxies here if needed
    }
  }
})
