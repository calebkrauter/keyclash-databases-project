<template>
    <nav v-if="showNavbar" class="navbar">
       
        <div class="logo">
            <img :src="keyclashlogo" alt="KeyClash Logo">
        </div>
        <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/#about-game">About The Game</a></li>
            <li><a href="/#meet-team">Meet The Team</a></li>
            <li><router-link :to="{ path: '/Userauth', query: { mode: 'register' }}" class="registration">Register</router-link></li>
            <li><router-link :to="{ path: '/Userauth', query: { mode: 'login' }}" class="registration">Login</router-link></li>
    
        </ul>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import keyclashlogo from '@/public/keyclashlogo.png'

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
        #B70159);

    /* Add these lines for the fade-in effect */
    animation: fadeIn 2s ease-in-out forwards;
}

.logo img {
    display: flex;
    justify-content: left;
    height: 3rem;
    margin-left: 1rem;
    width: auto;
}

.nav-links {
    display: flex;
    padding: 1rem 2rem;
    list-style: none;
}

.nav-links li {
    margin-left: 1rem;
}

.nav-links a {
    text-decoration: none;
    color: #ffffff;
}
</style>