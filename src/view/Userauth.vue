<template>
<div class="userauth-container">
        
        <div class="auth-content">
            <component :is="currentComponent" />
        </div>
        <div class="toggle-buttons">
            <Login v-if="currentComponent === 'Login'" />
            <Register v-if="currentComponent === 'Register'" />
            <div class="button-container">
    <button id="login-button" v-if="currentComponent === 'Register'" @click="setComponent('Login')"
      :class="{ active: currentComponent === 'Login' }">Login</button>
    <button id="register-button" v-if="currentComponent === 'Login'" @click="setComponent('Register')"
      :class="{ active: currentComponent === 'Register' }">Register</button>
    <button id ="return" @click="returnHome">Return</button>
    </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
const router = useRouter();
const currentRoute = useRoute();
const currentComponent = ref('Login');

const setComponent = (component) => {
    currentComponent.value = component;
};

const updateComponentFromRoute = () => {
    currentComponent.value = currentRoute.query.mode === 'register' ? 'Register' : 'Login';
};

onMounted(updateComponentFromRoute);

watch(() => currentRoute.query, updateComponentFromRoute, { deep: true });
const returnHome = () => {
    router.push('/')
}
</script>

<style scoped>
.userauth-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button-container{
    display:flex;
    justify-content: center;
    gap: 0.5rem;
}

.auth-content {
    display: flex;
    align-items: stretch;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}

.auth-component {
    width: 300px; /* Adjust as needed */
    padding: 20px;
}

.toggle-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding:5rem;  
}

.toggle-buttons button {
    padding: 10px;
    font-size: 14px;
    background-color: #ffffff;
    
    border: none;
    cursor: pointer;
    width: 100px; /* Adjust as needed */
    text-align: center;
    
}

.toggle-buttons button.active {
    background-color: #007bff;
    color: white;
}


.return:hover {
    background-color: #007bff;

}
</style>