import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }],
  },
  server: {
    proxy: {
      '/api/v1/': 'https://cinegalaxy-server.onrender.com',
      '/uploads/': 'http://localhost:7777',
    },
    port: 3000,
  },
})