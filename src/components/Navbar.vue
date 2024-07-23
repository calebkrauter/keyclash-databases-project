<template>
    <nav class="navbar">
        <div class="logo">
            <img :src="keyclashlogo" alt="KeyClash Logo">
        </div>
        <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#about-us">About us</a></li>
        </ul>
    </nav>
</template>

<script>
import keyclashlogo from '@/public/keyclashlogo.png'

export default {
    name: 'Navbar',
    data() {
        return {
            keyclashlogo
        }
    }
}
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
    background-color:aliceblue;

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
    color: #333;
}
</style>