import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as pkg from './package.json'

console.log(pkg.name)
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
    host: true,
    proxy: {
      '/jwlz-application-sjjc': {
        // target: 'http://192.168.2.144:8088',
        target: 'http://product430-prod.kg.plantdata.cn',
        rewrite: (path) => {
          return path.replace('/jwlz-application-sjjc', '/api/kgms')
        },
        changeOrigin: true
      },
      '/api': {
        target: 'http://product430-prod.kg.plantdata.cn',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist/' + pkg.name
  }
})
