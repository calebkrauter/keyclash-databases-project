
<template>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/store'; // Make sure this path is correct
  import { storeToRefs } from 'pinia';
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  // const API_URL = process.env.API_URL || 'http://localhost:5001'; 
  const API_URL = 'http://localhost:5001';
  
  const authStore = useAuthStore();
  const {isLoggedIn, login} = storeToRefs(authStore)
  
  const handleLogin = async () => {
    console.log('Login attempt', { email: email.value, password: password.value });
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password_hash: password.value
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // TODO query to check if the login exists or not.

      // Use the Pinia store to login
      await authStore.login({ email: email.value });
      console.log('Logged in:', authStore.isLoggedIn);
      
      // Redirect or perform other actions after successful login
      router.push('/'); 
    } catch (err) {
      console.error('Login failed:', err);
      // Handle login error (show message to user, etc.)
    }
  };
  </script>
  
  
  <style scoped>
  .login-form {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
  <style scoped>
  .login-form {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>