
<template>
  <div id = "app">
    <component :is="route.path.includes('/Userauth') ? null : Navbar" />
    <RouterView />
  </div>

</template>
<script setup>

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue'  
import { RouterView } from 'vue-router';
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const route = useRoute();
const API_URL = 'http://localhost:5001';


const NavbarComponent = computed(() => {
  return route.path.includes('/Userauth') ? null : Navbar;
});

// window.addEventListener('beforeunload', () => {
//   // TODO request with the stats to DB.
//   const response = await fetch(`${API_URL}/api/userData`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({

//     })
//   })
  // console.log('Login attempt', { email: email.value, password: password.value });
    // try {
    //   const response = await fetch(`${API_URL}/api/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: email.value,
    //       password_hash: password.value
    //     })
    //   });
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const data = await response.json();
      
    //   // TODO query to check if the login exists or not.

    //   // Use the Pinia store to login
    //   await authStore.login({ email: email.value });
    //   console.log('Logged in:', authStore.isLoggedIn);
      
    //   // Redirect or perform other actions after successful login
    //   router.push('/'); 
    // } catch (err) {
    //   console.error('Login failed:', err);
    //   // Handle login error (show message to user, etc.)
    // }
  // };
// })
</script>
<style>
html {
  scroll-behavior: smooth;
}
</style>