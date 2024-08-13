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
      <button type="submit" :disabled="isLoading">{{ isLoading ? 'Registering...' : 'Register' }}</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
// import bcrypt from 'bcryptjs';


const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const hashedPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const API_URL = process.env.API_URL || 'http://localhost:5001'; 

const handleRegister = async () => {
  error.value = '';
  successMessage.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  
  // const hashedPassword = await bcrypt.hash(password.value, 10);

  isLoading.value = true;

  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        //password_hash: hashedPassword.value
        password_hash: password.value
      }),
    });
    console.log(({
        username: name.value,
        email: email.value,
        //password_hash: hashedPassword.value
        password_hash: password.value

      }));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('User registered:', data);
    successMessage.value = 'Registration successful!';
    name.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    hashedPassword.value = '';
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      router.push('/');
    }, 1000);
    
  }
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

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>