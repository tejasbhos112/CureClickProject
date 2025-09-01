import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        // rewrite /api -> '' so backend receives '/patient/login'
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})