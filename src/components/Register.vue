
<template>
    <div class="register-form">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  
  const handleRegister = () => {
    // Implement your registration logic here
    console.log('Register attempt', { 
      name: name.value, 
      email: email.value, 
      password: password.value,
      confirmPassword: confirmPassword.value
    });
  };
  </script>
  
  <style scoped>
  .register-form {
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
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>