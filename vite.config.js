import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/' + pkg.name + '/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/jwlz-application-zstp': {
        target: 'http://192.168.2.144:8088',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist/' + pkg.name
  }
})
