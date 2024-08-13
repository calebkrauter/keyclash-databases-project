<template>
    <nav v-if="showNavbar" class="navbar">
      <div class="logo">
        <img :src="keyclashlogo" alt="KeyClash Logo">
      </div>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/#about-game">About The Game</a></li>
        <li><a href="/#meet-team">Meet The Team</a></li>
        <li v-if="authStore.isLoggedIn === false">
          <router-link :to="{ path: '/Userauth', query: { mode: 'register' }}" class="btn btn-register">Register</router-link>
        </li>
        <li v-if="authStore.isLoggedIn === false">
          <router-link :to="{ path: '/Userauth', query: { mode: 'login' }}" class="btn btn-login">Login</router-link>
        </li>
        <li v-if="authStore.isLoggedIn === true">
          <Profile title="Profile" />
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import Profile from '@/components/Profile.vue';
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import keyclashlogo from '@/public/keyclashlogo.png'
  
  const authStore = useAuthStore();
  const { isLoggedIn, logout } = storeToRefs(authStore)
  const route = useRoute();
  
  const showNavbar = computed(() => {
    const hiddenRoutes = ['/Userauth'];
    return !hiddenRoutes.some(hiddenRoute => route.path.includes(hiddenRoute));
  });
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-image: linear-gradient(to right,
      #FFC3A8,
      #F57E9A,
      #EB3E8C,
      #D61F77,
      #B70159
    );
    animation: fadeIn 2s ease-in-out forwards;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .logo img {
    height: 3rem;
    width: auto;
    margin-left: 1rem;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-links li {
    margin-left: 1.5rem;
  }
  
  .nav-links a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
  
  .nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .btn-register {
    background-color: #ffffff;
    color: #D61F77;
  }
  
  .btn-login {
    background-color: transparent;
    border: 2px solid #ffffff;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .btn-register:hover {
    background-color: #f0f0f0;
  }
  
  .btn-login:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  </style>