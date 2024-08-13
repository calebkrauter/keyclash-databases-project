import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDataStore = defineStore('userData', () => {

  const countClicks = ref(0);
  const countKeyPresses = ref(0);
  const countWordsTyped = ref(0);
  const countCharactersTyped = ref(0);
  const countBackspaces = ref(0);
  const timeOfRegistration = ref(null)

  function incrementClicks() {
    countClicks.value++;
  }
  function incrementKeyPresses() {
    countKeyPresses.value++;
  }
  function incrementWordsTyped() {
    countWordsTyped.value++;
  }
  function incrementCharactersTyped() {
    countCharactersTyped.value++;
  }
  function incrementBackspaces() {
    countBackspaces.value++;
  }
  function getTimeSinceRegister() {
    timeOfRegistration.value = new Date().toISOString();
  }
  return {
    countClicks,
    countKeyPresses,
    countWordsTyped,
    countCharactersTyped,
    countBackspaces,
    timeOfRegistration,
    incrementClicks,
    incrementKeyPresses,
    incrementWordsTyped,
    incrementCharactersTyped,
    incrementBackspaces,
    getTimeSinceRegister
  }
})

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