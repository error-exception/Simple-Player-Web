import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: true
  },
  base: './',
  plugins: [vue({
    script: {
      defineModel: true
    }
  }), vueJsx()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // balive2d: resolve(__dirname, 'balive2d/index.html')
      }
    },
    minify: false,
    outDir: './docs'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.42.129:8888',
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
