import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: homepage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes

})

export default router