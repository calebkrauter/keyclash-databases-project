<!-- 
Refactored code from this tutorial 
https://javascript.plainenglish.io/how-to-set-up-a-dropdown-navbar-router-with-vuejs-6e0ef48625f6 -->
<template>
  <div class="menu-item" @click="toggleMenu">
    <a href="#">
      {{ title }}
    </a>
    <svg viewBox="0 0 1030 638" width="10">
      <path d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z" fill="#FFF"></path>
    </svg>
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <div class="menu-item">
          <li><router-link to="">Account</router-link></li>
        </div>
        <div class="menu-item">
          <li><router-link to="">Stats</router-link></li>
        </div>
        <div class="menu-item">
          <li  @click ="authStore.logout"><router-link :to="{ path: '/'}" >Logout</router-link></li>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store';
import { storeToRefs } from 'pinia';
const authStore = useAuthStore();
const { isLoggedIn, logout } = storeToRefs(authStore)
const props = defineProps({
  title: String
});

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>
<style>
a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}
.menu-items li:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
</style>