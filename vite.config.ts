import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // balive2d: resolve(__dirname, 'balive2d/index.html')
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.31.184:8888',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
