
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


const NavbarComponent = computed(() => {
  return route.path.includes('/Userauth') ? null : Navbar;
});
</script>
<style>
html {
  scroll-behavior: smooth;
}
</style>