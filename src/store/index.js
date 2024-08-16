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
  const token = ref(localStorage.getItem('token') || null)
  const isLoggedIn = ref(!!token.value)
  const user = ref( null)
  const API_URL = 'http://localhost:5001';

  // Getters  
  const username = ref(localStorage.getItem('user') || null)

  // Actions
  async function login(credentials) {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      token.value = data.token;
      
      isLoggedIn.value = true;
      user.value = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.user.username);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    isLoggedIn.value = false;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function getAuthHeader() {
    return token.value ? { 'Authorization': `Bearer ${token.value}` } : {}
  }

  return {
    isLoggedIn,
    user,
    username,
    login,
    logout,
    getAuthHeader
  }
})