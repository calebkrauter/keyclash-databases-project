import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000, // or any port you prefer for development
    proxy: {
      '/api': 'http://localhost:8080' // proxy API requests to your Express server
    }
  }
})