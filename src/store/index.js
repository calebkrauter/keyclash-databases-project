// stores/counter.js
import { defineStore } from 'pinia'
import App from "./App.vue"

export const useAuthStore = defineStore('auth', () => {
  //State
  const isLoggedin = ref(false)
  const user = ref(null)


  //Getters
  const username = computed(() => user.value?.name ?? 'Guest')

  //Actions
  function login(credentials) {
    return new Promise((resolve) =>
      setTimeout(() => {
        isLoggedin.value = true

      }
      )
    )
  }
  function logout() {
    isLoggedin.value = false
    user.value = null
  }
  return {
    isLoggedin,
    username,
    username,
    login,
    logout
  }
})