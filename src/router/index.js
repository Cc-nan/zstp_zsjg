import { createRouter, createWebHistory } from 'vue-router'
import zstpRouter from './zstp/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/zstp'
    }
  ].concat(zstpRouter)
})

export default router
