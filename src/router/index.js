import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/views/Home.vue'
import TypingGame from '@/views/TypingGame.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: homepage
  },
  {
    path: '/game',
    name: 'TypingGame',
    component: TypingGame
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes

})

export default router