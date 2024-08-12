
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
  const router = useRouter();
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const API_URL = 'http://localhost:5001'; 

  const handleLogin = async() => {

    // Implement your login logic here
    // This console log is getting reached twice, is the post happening twice too?
    
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
        throw new Error(response.status);
      }
    } catch (err) {
      throw err
    } 
    finally {
    setTimeout(() => {
      router.push('/');
      // This delay is added to reduce security vulnerabiltiy so all logins are consistent regardless of if data is retrieved.
    }, 500)};
  

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