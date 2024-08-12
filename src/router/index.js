import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/view/Home.vue'
import TypingGame from '@/view/TypingGame.vue'
import Userauth from '@/view/Userauth.vue'

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
  },
  {
    path: '/Userauth',
    name: 'Userauth',
    component: Userauth
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes

});

export default router