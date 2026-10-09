import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Avoids CORS in development: the browser talks to Vite, which forwards to the API.
    proxy: {
      '/api': { target: 'https://aztuapi.alakbaroff.com', changeOrigin: true },
    },
  },
})
