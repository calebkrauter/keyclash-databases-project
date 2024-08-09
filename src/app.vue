
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