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
        // target: 'http://172.31.44.32:8888',
        // target: 'http://192.168.31.186:8888',
        target: 'http://192.168.42.129:8888',
        // target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/res': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/res/, '')
      }
    }
  }
})
