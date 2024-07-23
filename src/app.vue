<script>
import Navbar from '@/components/Navbar.vue'
import {RouterView} from 'vue-router';
</script>
<template>
  <Navbar />
  <RouterView />
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>