import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  // const token = ref()
  const isLoggedIn = ref(false)
  const user = ref(null)

  // Getters
  const username = computed(() => user.value?.name ?? 'Guest')

  // Actions
  function login(credentials) {
    return new Promise((resolve) => {

      setTimeout(() => {
        isLoggedIn.value = true
        user.value = { name: credentials.email } // Set user data
        // verifyLogin();
        resolve()
      }, 1000) // Simulating API delay
    })
  }




  function logout() {
    setTimeout(() => {
      isLoggedIn.value = false
      user.value = null
    }, 1000);

  }

  return {
    isLoggedIn,
    user,
    username,
    login,
    logout
  }
})